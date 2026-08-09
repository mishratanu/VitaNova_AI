import { GoogleGenerativeAI } from '@google/generative-ai';
import type { TriageRequest, TriageResponse } from '../src/types/index';

// ─── Critical Safety: Pregnancy Danger Signs ───────────────────────────────
const PREGNANCY_DANGER_SIGNS_EN = [
  'vaginal bleeding', 'blurred vision', 'severe headache', 'reduced fetal movement',
  'swelling of face', 'swelling of hands', 'convulsions'
];
const PREGNANCY_DANGER_SIGNS_HI = [
  'खून', 'रक्तस्राव', 'धुंधली दृष्टि', 'भ्रूण की हलचल', 'तेज सिरदर्द',
  'सूजन', 'दौरे', 'बेहोश', 'सीने में दर्द', 'सांस लेने में कठिनाई', 'तेज बुखार',
];

function detectPregnancyDangerSigns(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const sign of [...PREGNANCY_DANGER_SIGNS_EN, ...PREGNANCY_DANGER_SIGNS_HI]) {
    if (lower.includes(sign.toLowerCase())) found.push(sign);
  }
  return found;
}

function buildSystemPrompt(pregnancyFlag: boolean, questionCount: number): string {
  const pregnancyNote = pregnancyFlag
    ? '\n⚠️ PREGNANCY FLAG IS SET. Apply maximum caution. Any danger sign mentioned must result in RED severity.'
    : '';

  const questionGuidance =
    questionCount >= 2
      ? 'You have asked enough clarifying questions. Return the FINAL RESULT JSON now.'
      : `You may ask up to ${2 - questionCount} more clarifying question(s) if truly needed, then return the result.`;

  return `You are VitaNova AI, a cautious medical triage assistant for rural India.

RULES (non-negotiable):
1. NEVER suggest specific medicines, doses, or treatments.
2. Be cautious, but accurately classify mild symptoms as green. Do not invent or assume severe symptoms that the user hasn't explicitly mentioned.
3. Pay strict attention to negations (e.g. "no", "none", "don't"). If a patient explicitly denies a symptom, you MUST NOT record it as a danger sign or escalate severity based on it.
3. You are NOT a doctor and cannot diagnose.
4. ALL text fields must be provided in BOTH English AND Hindi.${pregnancyNote}

TRIAGE PROCESS:
- ${questionGuidance}
- Return ONLY raw JSON — no markdown, no extra text.

For clarifying questions use this EXACT JSON (both languages required):
{"type":"question","question_en":"<your question in English>","question_hi":"<same question in Hindi using Devanagari script>"}

For the final assessment use this EXACT JSON (both languages required):
{"type":"result","severity":"green"|"yellow"|"red","reason":"<plain English reason>","reason_hi":"<same reason in Hindi using Devanagari script>","advice":["<action 1 in English>","<action 2>","<action 3>"],"dangerSignsDetected":["<sign>"]}

SEVERITY GUIDELINES:
- green: Minor, manageable at home with rest and fluids
- yellow: Moderate — needs clinic visit within 1–2 days
- red: Severe/emergency — needs immediate medical attention

Only escalate severity if the described symptoms match known danger signs, or if the situation is genuinely ambiguous and potentially dangerous.`;
}

function isValidGeminiApiKey(key: string | undefined): boolean {
  if (!key || key === 'your_gemini_api_key_here' || key.trim() === '') return false;
  // Accepts keys starting with "AIzaSy" (legacy format) or "AQ." (new Google AI Studio format)
  const trimmed = key.trim();
  return trimmed.startsWith('AIzaSy') || trimmed.startsWith('AQ.') || trimmed.length >= 20;
}

async function callGeminiRestApi(
  apiKey: string,
  systemInstruction: string,
  promptText: string
): Promise<string> {
  const trimmedKey = apiKey.trim();
  const endpoints = [
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
  ];
  let lastError: any = null;

  for (const baseUrl of endpoints) {
    try {
      const url = `${baseUrl}?key=${encodeURIComponent(trimmedKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Omit x-goog-api-key header to prevent Google API gateway from misinterpreting AQ. keys as OAuth tokens
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              parts: [{ text: promptText }],
            },
          ],
        }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        let errJson: any;
        try {
          errJson = JSON.parse(responseText);
        } catch (_) {}
        const errorMsg = errJson?.error?.message || responseText || response.statusText;
        lastError = new Error(`Gemini API Error (${response.status}): ${errorMsg}`);
        continue;
      }

      const data = JSON.parse(responseText);
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (output) return output;
    } catch (err: any) {
      lastError = err;
    }
  }

  if (lastError?.message?.includes('401')) {
    throw new Error('Invalid Gemini API Key (401 Unauthorized). Please check your GEMINI_API_KEY in the .env file or get a new key from https://aistudio.google.com/app/apikey');
  }

  throw lastError || new Error('Failed to fetch from Gemini REST API.');
}

async function generateContentWithFallback(
  apiKey: string,
  systemInstruction: string,
  promptText: string
): Promise<string> {
  const trimmedKey = apiKey.trim();

  // "AQ." format key — Google SDK erroneously sends Authorization: Bearer header causing 401 ACCESS_TOKEN_TYPE_UNSUPPORTED.
  // Direct REST API must be used without Authorization header.
  if (trimmedKey.startsWith('AQ.')) {
    return await callGeminiRestApi(trimmedKey, systemInstruction, promptText);
  }

  // Legacy "AIzaSy..." format key — Try SDK first, fallback to REST
  try {
    const genAI = new GoogleGenerativeAI(trimmedKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction,
    });
    const result = await model.generateContent(promptText);
    return result.response.text();
  } catch (sdkError: any) {
    console.warn('[triageHandler] SDK call failed, falling back to direct REST API:', sdkError?.message || sdkError);
    return await callGeminiRestApi(trimmedKey, systemInstruction, promptText);
  }
}

function createRuleBasedFallback(
  symptoms: string,
  messages: any[],
  questionCount: number,
  pregnancyFlag: boolean
): TriageResponse {
  // Only evaluate the patient's own words! Include symptoms and user replies, but exclude AI's questions.
  const userMessages = messages.filter((m) => m.role === 'user').map((m) => m.content);
  const fullText = [symptoms, ...userMessages].join(' ').toLowerCase();

  // If initial step and questionCount is 0, ask a clarifying question
  if (questionCount === 0) {
    return {
      type: 'question',
      question: 'How long have you had these symptoms, and do you also have any high fever, severe headache, or difficulty breathing?',
      question_en: 'How long have you had these symptoms, and do you also have any high fever, severe headache, or difficulty breathing?',
      question_hi: 'आपको ये लक्षण कब से हैं, और क्या आपको तेज़ बुखार, गंभीर सिरदर्द या सांस लेने में तकलीफ भी है?',
    };
  }

  // Determine severity based on symptom keywords
  const redKeywords = ['chest pain', 'bleeding', 'unconscious', 'faint', 'convulsion', 'seizure', 'severe headache', 'breathlessness', 'cannot breathe', 'blurred vision', 'dizziness'];
  const yellowKeywords = ['fever', 'vomiting', 'diarrhea', 'weakness', 'rash', 'pain', 'cough'];

  let severity: 'green' | 'yellow' | 'red' = 'green';
  let detected: string[] = [];

  for (const kw of redKeywords) {
    if (fullText.includes(kw)) {
      // Basic negation check (e.g., "no chest pain", "not bleeding")
      const isNegated = fullText.includes(`no ${kw}`) || fullText.includes(`not ${kw}`) || fullText.includes(`no severe ${kw}`);
      if (!isNegated) {
        severity = 'red';
        detected.push(kw.charAt(0).toUpperCase() + kw.slice(1));
      }
    }
  }

  if (severity !== 'red') {
    for (const kw of yellowKeywords) {
      if (fullText.includes(kw)) {
        const isNegated = fullText.includes(`no ${kw}`) || fullText.includes(`not ${kw}`);
        if (!isNegated) {
          severity = 'yellow';
        }
      }
    }
  }

  if (pregnancyFlag) {
    const pregDanger = detectPregnancyDangerSigns(fullText);
    if (pregDanger.length > 0) {
      severity = 'red';
      detected = Array.from(new Set([...detected, ...pregDanger]));
    }
  }

  if (severity === 'red') {
    return {
      type: 'result',
      severity: 'red',
      reason: 'Critical or urgent symptoms detected requiring immediate evaluation at a healthcare facility.',
      reason_hi: 'गंभीर या आपातकालीन लक्षण पाए गए हैं जिनके लिए तुरंत नजदीकी स्वास्थ्य केंद्र में चिकित्सा जांच आवश्यक है।',
      advice: [
        'Call 108 emergency ambulance or arrange immediate transport to the nearest hospital.',
        'Inform a family member or local ASHA healthcare worker right away.',
        'Rest in a comfortable position and do not take unprescribed medication.',
      ],
      advice_hi: [
        '108 आपातकालीन एम्बुलेंस को कॉल करें या तुरंत नजदीकी अस्पताल पहुंचने की व्यवस्था करें।',
        'किसी परिजन या स्थानीय आशा (ASHA) कार्यकर्ता को तुरंत सूचित करें।',
        'आरामदायक स्थिति में रहें और बिना डॉक्टर की सलाह के कोई दवा न लें।',
      ],
      dangerSignsDetected: detected.length > 0 ? detected : ['Urgent Symptoms Detected'],
    };
  }

  if (severity === 'yellow') {
    return {
      type: 'result',
      severity: 'yellow',
      reason: 'Moderate symptoms observed. It is recommended to visit your local Primary Health Centre (PHC) within 1–2 days for examination.',
      reason_hi: 'मध्यम लक्षण दिखाई दे रहे हैं। 1–2 दिनों के भीतर जांच के लिए अपने स्थानीय प्राथमिक स्वास्थ्य केंद्र (PHC) जाने की सलाह दी जाती है।',
      advice: [
        'Visit your nearest Primary Health Centre (PHC) for a doctor examination.',
        'Stay hydrated by drinking clean water and oral rehydration solutions (ORS).',
        'Monitor temperature and symptoms closely; seek emergency care if symptoms worsen.',
      ],
      advice_hi: [
        'डॉक्टर की जांच के लिए अपने निकटतम प्राथमिक स्वास्थ्य केंद्र (PHC) जाएँ।',
        'साफ पानी और ओआरएस (ORS) पीकर शरीर में पानी की मात्रा बनाए रखें।',
        'तापमान और लक्षणों पर नज़र रखें; लक्षण बिगड़ने पर तुरंत डॉक्टर से मिलें।',
      ],
      dangerSignsDetected: [],
    };
  }

  return {
    type: 'result',
    severity: 'green',
    reason: 'Mild symptoms detected. Safe to manage at home with adequate rest, fluids, and home care remedies.',
    reason_hi: 'हल्के लक्षण पाए गए हैं। पर्याप्त आराम, तरल पदार्थ और घरेलू देखभाल के साथ घर पर सुरक्षित प्रबंधन संभव है।',
    advice: [
      'Get plenty of rest and drink adequate fluids like warm water or lemon water.',
      'Eat light, warm, easy-to-digest meals.',
      'If symptoms persist beyond 48 hours or worsen, visit your local clinic.',
    ],
    advice_hi: [
      'पर्याप्त आराम करें और गुनगुना पानी या नींबू पानी जैसे तरल पदार्थ पिएं।',
      'हल्का, गर्म और आसानी से पचने वाला भोजन लें।',
      'यदि 48 घंटे के बाद भी लक्षण बने रहते हैं या बढ़ते हैं, तो क्लिनिक जाएँ।',
    ],
    dangerSignsDetected: [],
  };
}

export async function triageHandler(body: TriageRequest): Promise<TriageResponse> {
  const { symptoms, language, pregnancyFlag, messages, questionCount } = body;

  const apiKey = process.env.GEMINI_API_KEY;

  const systemPrompt = buildSystemPrompt(pregnancyFlag, questionCount);

  // Build the full conversation as a single prompt string
  const conversationParts: string[] = [];

  if (messages.length === 0) {
    // First call — just the symptoms
    conversationParts.push(`Patient symptoms: ${symptoms}`);
  } else {
    // Reconstruct the full conversation
    conversationParts.push(`Patient symptoms: ${symptoms}`);
    for (const msg of messages) {
      const prefix = msg.role === 'user' ? 'Patient' : 'AI';
      conversationParts.push(`${prefix}: ${msg.content}`);
    }
  }

  const promptText = conversationParts.join('\n');

  let parsed: TriageResponse;

  try {
    if (!isValidGeminiApiKey(apiKey)) {
      throw new Error('Missing or placeholder API Key.');
    }

    let rawText = await generateContentWithFallback(apiKey!, systemPrompt, promptText);

    // Strip any markdown code blocks Gemini may wrap the JSON in
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Extract just the JSON object
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON found in AI response.');

    parsed = JSON.parse(jsonMatch[0]) as TriageResponse;

    // Normalise bilingual fields so downstream code always has both versions
    if (parsed.type === 'question') {
      if (!parsed.question && parsed.question_en) {
        parsed.question = parsed.question_en;
      } else if (parsed.question && !parsed.question_en) {
        parsed.question_en = parsed.question;
        parsed.question_hi = parsed.question;
      }
      parsed.question_en = parsed.question_en || parsed.question || '';
      parsed.question_hi = parsed.question_hi || parsed.question_en;
      parsed.question = parsed.question_en;
    }

    if (parsed.type === 'result') {
      parsed.reason_hi = parsed.reason_hi || parsed.reason;
    }
  } catch (err: any) {
    console.warn('[triageHandler] API call unavailable or failed, using smart triage fallback:', err?.message || err);
    // Fallback guarantees complete triage flow execution without crashing
    parsed = createRuleBasedFallback(symptoms, messages, questionCount, pregnancyFlag);
  }

  // ─── CRITICAL SAFETY RULE: Pregnancy Danger Sign Override ────────────────
  // This is a deterministic code rule — NOT prompt-dependent.
  // If pregnancyFlag=true AND any danger sign is present → FORCE red.
  if (pregnancyFlag && parsed.type === 'result') {
    const allText = [
      symptoms,
      ...messages.map((m) => m.content),
    ].join(' ');

    const detected = detectPregnancyDangerSigns(allText);

    if (detected.length > 0) {
      parsed.severity = 'red'; // FORCED override
      parsed.dangerSignsDetected = Array.from(new Set([...(parsed.dangerSignsDetected ?? []), ...detected]));
      parsed.reason = 'Pregnancy danger sign detected — this overrides the AI assessment. Please call 108 immediately.';
      parsed.reason_hi = 'गर्भावस्था में खतरे का संकेत मिला — यह AI मूल्यांकन को ओवरराइड करता है। कृपया तुरंत 108 पर कॉल करें।';
      parsed.forcedBySafetyRule = true;
    }
  }

  return parsed;
}
