import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTriage } from '../hooks/useTriage';
import StepDescribe from '../components/app/StepDescribe';
import StepQA from '../components/app/StepQA';
import StepResult from '../components/app/StepResult';
import StepAction from '../components/app/StepAction';
import Logo from '../components/ui/Logo';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const STEPS = ['describe', 'qa', 'result', 'action'] as const;
const STEP_LABELS: Record<string, { en: string; hi: string }> = {
  describe: { en: 'Symptoms', hi: 'लक्षण' },
  qa: { en: 'Questions', hi: 'प्रश्न' },
  result: { en: 'Result', hi: 'परिणाम' },
  action: { en: 'Action', hi: 'कार्यवाही' },
};

function ProgressBar({ step, language }: { step: string; language: 'en' | 'hi' }) {
  const currentIndex = STEPS.indexOf(step as typeof STEPS[number]);

  return (
    <div className="flex items-center gap-2 w-full" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemax={4}>
      {STEPS.map((s, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${isComplete ? 'bg-primary text-white shadow-sm' : isCurrent ? 'bg-primary text-white scale-110 ring-4 ring-primary/25 shadow-md shadow-primary/30' : 'bg-gray-200 text-ink-light'}`}
              >
                {isComplete ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] whitespace-nowrap hidden sm:block transition-all duration-300
                ${isCurrent ? 'text-primary font-bold scale-105' : isComplete ? 'text-ink-muted font-medium' : 'text-ink-light font-medium'}`}>
                {STEP_LABELS[s][language]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 rounded-full transition-all duration-500 mt-[-14px]
                ${i < currentIndex ? 'bg-primary' : 'bg-gray-200'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AppPage() {
  const triage = useTriage();

  return (
    <>
      <title>VitaNova AI — Health Triage</title>
      <meta name="description" content="Get an AI health triage in Hindi or English — describe symptoms, answer questions, and receive a clear severity result." />

      <div className="min-h-screen bg-[#FAF9F6]">
        {/* App header */}
        <header className="bg-white border-b border-gray-100 shadow-card sticky top-0 z-40">
          <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
            <Logo size="sm" />
            <div className="text-xs text-ink-muted font-medium bg-primary-50 px-3 py-1.5 rounded-full">
              Free · No account needed
            </div>
          </div>
        </header>

        {/* Main content */}
        <main id="app-main" className="max-w-xl mx-auto px-4 py-6 space-y-6">

          {/* Progress */}
          <div className="card py-4 px-5">
            <ProgressBar step={triage.step} language={triage.language} />
          </div>

          {/* Step panels */}
          <div className="card min-h-[400px] relative overflow-hidden">
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                {triage.step === 'describe' && (
                  <StepDescribe
                    key="describe"
                    language={triage.language}
                    pregnancyFlag={triage.pregnancyFlag}
                    loading={triage.loading}
                    error={triage.error}
                    onLanguageChange={triage.setLanguage}
                    onPregnancyChange={triage.setPregnancyFlag}
                    onSubmit={triage.submitSymptoms}
                  />
                )}
                {triage.step === 'qa' && (
                  <StepQA
                    key="qa"
                    question={triage.currentQuestion}
                    question_en={triage.currentQuestionEn}
                    question_hi={triage.currentQuestionHi}
                    questionCount={triage.questionCount}
                    language={triage.language}
                    loading={triage.loading}
                    error={triage.error}
                    onAnswer={triage.submitAnswer}
                  />
                )}
                {triage.step === 'result' && triage.result && (
                  <StepResult
                    key="result"
                    result={triage.result}
                    language={triage.language}
                    symptoms={triage.symptoms}
                    messages={triage.messages}
                    onProceed={triage.proceedToAction}
                  />
                )}
                {triage.step === 'action' && triage.result && (
                  <StepAction
                    key="action"
                    result={triage.result}
                    language={triage.language}
                    onReset={triage.reset}
                  />
                )}
              </AnimatePresence>

              {/* Loading Overlay */}
              <AnimatePresence>
                {triage.loading && (
                  <motion.div
                    key="loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/90 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 rounded-3xl"
                  >
                    <div className="relative w-14 h-14 flex items-center justify-center mb-4">
                      <div className="absolute inset-0 border-4 border-primary-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-xl">🩺</span>
                    </div>
                    <p className="text-ink font-heading font-bold text-base text-center">
                      {triage.language === 'hi' ? 'आपके लक्षणों का विश्लेषण हो रहा है...' : 'Analyzing your symptoms...'}
                    </p>
                    <p className="text-ink-muted text-xs font-medium animate-pulse mt-1 text-center">
                      {triage.language === 'hi' ? 'नैदानिक दिशानिर्देशों का मूल्यांकन जारी है...' : 'Evaluating clinical triage guidance...'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ErrorBoundary>
          </div>

          {/* Back to landing */}
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-ink-muted hover:text-primary transition-colors mx-auto w-fit"
            aria-label="Back to home page"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </main>
      </div>
    </>
  );
}
