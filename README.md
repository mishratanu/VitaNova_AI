# VitaNova AI 🩺

> **AI-powered bilingual health triage for rural India**
> 
> VitaNova AI is an intelligent symptom triage tool powered by Google Gemini. It allows users in rural and underserved areas to describe their symptoms in English or Hindi, ask clarifying questions, and receive an instant, accurate triage assessment with clear severity levels and actionable next steps.

---

## ✨ Features

- 🌐 **Bilingual English & Hindi**: Clarifying questions and triage results display both English and Hindi text simultaneously for maximum accessibility.
- 🤖 **AI-Guided Symptom Triage**: Powered by Google Gemini to analyze symptoms, ask relevant follow-up questions, and assign a severity tier:
  - 🟢 **Green**: Safe to manage at home
  - 🟡 **Yellow**: Visit a clinic soon
  - 🔴 **Red**: Emergency — seek immediate care
- 🤰 **Pregnancy Safety Override**: Deterministic, code-level safety check that automatically forces **Red Severity** if any pregnancy danger sign is detected (e.g., vaginal bleeding, severe headache, blurred vision, swelling).
- 🔊 **Voice Narration (Text-to-Speech)**: Reads triage results aloud in both English and Hindi using the browser's Web Speech API for low-literacy users.
- 🎙️ **Voice Symptom Input**: Speech-to-text input powered by the Web Speech API for hands-free or spoken symptom reporting.
- 🗺️ **Nearest PHC Directions**: Integrated location services to locate and navigate to the nearest Primary Health Centre (PHC) on Google Maps.
- 📋 **Bilingual Action Cards**: Plain-language recommendations and step-by-step guidance formatted for easy reading.

---

## 🛠️ Tech Stack

- **Frontend**: React (v18.3.1), TypeScript (v5.6.2), Vite (v5.4.10)
- **Styling & Animations**: Tailwind CSS (v3.4.19), Framer Motion (v12.42.2)
- **Icons**: Lucide React (v1.27.0)
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai` v0.24.1) using the `gemini-flash-latest` model
- **Backend Proxy**: Express (v5.2.1) + Node.js with `tsx` (v4.23.1) and `dotenv` (v17.4.2)
- **Development Tooling**: Concurrently (v10.0.4) for running frontend & backend proxy simultaneously

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- A Google Gemini API key from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/mishratanu/VitaNova_AI.git
   cd VitaNova_AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

   > 🔒 **Security Note**: The `.env` file is included in `.gitignore` and is never committed to Git repository control. Users running or deploying the project must provide their own Gemini API key in their local `.env` file.

4. **Run the Application**
   Start both the Vite dev server and the backend proxy concurrently:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📁 Folder Structure

```
vitaNova AI/
├── lib/
│   └── triageHandler.ts       # Gemini API prompt engineering & pregnancy safety override
├── server/
│   └── index.ts               # Express backend server (proxies Gemini API calls safely)
├── src/
│   ├── components/
│   │   ├── app/               # Triage flow steps (StepDescribe, StepQA, StepResult, StepAction)
│   │   └── landing/           # Landing page hero & features sections
│   ├── hooks/
│   │   └── useTriage.ts       # State machine managing symptom intake, QA & result flow
│   ├── pages/
│   │   ├── AppPage.tsx        # Main triage app view
│   │   └── LandingPage.tsx    # Landing page view
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces for requests, responses & results
│   ├── App.tsx                # Main router & layout shell
│   └── index.css              # Custom Tailwind CSS rules & healthcare color tokens
├── .env.example               # Template for required environment variables
├── .gitignore                 # Excludes .env, node_modules, dist, logs
├── package.json               # Project dependencies and script declarations
├── vite.config.ts             # Vite server config & API proxy configuration
└── README.md                  # Project documentation
```

---

## ⚠️ Medical Disclaimer

> **VitaNova AI is a medical triage assistant designed for informational and preliminary assessment purposes only. It is NOT a diagnostic tool and does NOT provide medical advice, diagnosis, or treatment.**
>
> VitaNova AI should never be used as a substitute for professional medical evaluation by a qualified healthcare provider. In the event of a medical emergency, immediately contact emergency services (e.g., dial **108** in India) or visit the nearest healthcare facility.
