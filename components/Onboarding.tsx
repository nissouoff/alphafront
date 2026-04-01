"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState<1 | 2>(1);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    const createStarted = localStorage.getItem("onboarding_create_started");
    
    if (!completed) {
      setTimeout(() => setIsVisible(true), 500);
    } else if (!createStarted) {
      setPhase(2);
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const phase1Steps = [
    {
      icon: "⚡",
      title: t("onboardingTitle1"),
      description: t("onboardingDesc1"),
    },
    {
      icon: "📄",
      title: t("onboardingTitle2"),
      description: t("onboardingDesc2"),
    },
    {
      icon: "🏪",
      title: t("onboardingTitle3"),
      description: t("onboardingDesc3"),
    },
    {
      icon: "📦",
      title: t("onboardingTitle4"),
      description: t("onboardingDesc4"),
    },
    {
      icon: "🚀",
      title: t("onboardingTitle5"),
      description: t("onboardingDesc5"),
    },
  ];

  const phase2Steps = [
    {
      icon: "🎯",
      title: t("onboarding2Title1"),
      description: t("onboarding2Desc1"),
      type: "landing" as const,
    },
    {
      icon: "🛍️",
      title: t("onboarding2Title2"),
      description: t("onboarding2Desc2"),
      type: "boutique" as const,
    },
  ];

  const steps = phase === 1 ? phase1Steps : phase2Steps;

  const handleCompletePhase1 = () => {
    localStorage.setItem("onboarding_completed", "true");
    setPhase(2);
    setCurrentStep(0);
  };

  const handleSkipAll = () => {
    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("onboarding_create_started", "true");
    setIsVisible(false);
    onComplete();
  };

  const handleNext = () => {
    if (phase === 1) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleCompletePhase1();
      }
    } else {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        localStorage.setItem("onboarding_create_started", "true");
        setIsVisible(false);
        onComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = (type: "landing" | "boutique") => {
    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("onboarding_create_started", "true");
    setIsVisible(false);
    onComplete();
    
    if (type === "landing") {
      router.push("/templates-landing");
    } else {
      router.push("/templates");
    }
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleSkipAll} />

      <div className={`relative w-full max-w-md transition-all duration-500 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl shadow-2xl border border-zinc-700/50 overflow-hidden">
          <div className={`relative h-48 flex items-center justify-center ${
            phase === 1 
              ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" 
              : "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500"
          }`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-white/60 transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="text-8xl animate-bounce">{step.icon}</div>
            <button
              onClick={handleSkipAll}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {phase === 2 && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium">
                {language === "ar" ? "إنشاء" : language === "en" ? "Create" : "Création"}
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? "w-8 bg-indigo-500"
                      : idx < currentStep
                      ? "w-2 bg-indigo-500/50"
                      : "w-2 bg-zinc-700"
                  }`}
                />
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-3">
              {step.title}
            </h2>
            <p className="text-zinc-400 text-center mb-8 leading-relaxed">
              {step.description}
            </p>

            {phase === 2 && (step as any).type && (
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => handleCreate((step as any).type)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {(step as any).type === "landing" 
                    ? (language === "ar" ? "صفحة هبوط" : language === "en" ? "Landing Page" : "Landing Page")
                    : (language === "ar" ? "متجر كامل" : language === "en" ? "Full Shop" : "Boutique")
                  }
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              {currentStep > 0 || phase === 2 ? (
                <button
                  onClick={phase === 2 && currentStep === 0 ? handleSkipAll : handlePrevious}
                  className="flex-1 py-3 px-6 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t("previous") || "Précédent"}
                </button>
              ) : (
                <button
                  onClick={handleSkipAll}
                  className="flex-1 py-3 px-6 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-colors"
                >
                  {t("skip") || "Passer"}
                </button>
              )}

              {phase === 1 && (
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      {t("finish") || "Terminer"}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      {t("next") || "Suivant"}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="px-8 pb-6 flex justify-center">
            <button
              onClick={handleSkipAll}
              className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              {language === "ar" ? "تم" : language === "en" ? "Done" : "Terminé"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
