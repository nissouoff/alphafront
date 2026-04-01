"use client";

import { useState, useEffect, useRef } from "react";
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
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [phase, setPhase] = useState<1 | 2>(1);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    const createStarted = localStorage.getItem("onboarding_create_started");

    if (!completed) {
      setPhase(1);
      setTimeout(() => setIsVisible(true), 300);
    } else if (!createStarted) {
      setPhase(2);
      setTimeout(() => setIsVisible(true), 300);
    }
  }, []);

  useEffect(() => {
    if (isVisible && phase === 2) {
      updateTargetPosition();
    }
  }, [isVisible, currentStep, phase]);

  const updateTargetPosition = () => {
    const selectors = [
      "[data-guide='landing-btn']",
      "[data-guide='create-landing-btn']",
      "[data-guide='template-card']",
    ];
    const selector = selectors[currentStep];
    if (selector) {
      const el = document.querySelector(selector);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    }
  };

  const phase1Steps = [
    { icon: "⚡", title: t("onboardingTitle1"), description: t("onboardingDesc1") },
    { icon: "📄", title: t("onboardingTitle2"), description: t("onboardingDesc2") },
    { icon: "🏪", title: t("onboardingTitle3"), description: t("onboardingDesc3") },
    { icon: "📦", title: t("onboardingTitle4"), description: t("onboardingDesc4") },
    { icon: "🚀", title: t("onboardingTitle5"), description: t("onboardingDesc5") },
  ];

  const phase2Steps = [
    { selector: "landing-btn", title: t("onboarding2Step1"), description: t("onboarding2Step1Desc") },
    { selector: "create-btn", title: t("onboarding2Step2"), description: t("onboarding2Step2Desc") },
    { selector: "template", title: t("onboarding2Step3"), description: t("onboarding2Step3Desc"), isLast: true },
  ];

  const handleSkipAll = () => {
    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("onboarding_create_started", "true");
    setIsVisible(false);
    onComplete();
  };

  const handleNext = () => {
    if (phase === 1) {
      if (currentStep < phase1Steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        localStorage.setItem("onboarding_completed", "true");
        setPhase(2);
        setCurrentStep(0);
        setTimeout(updateTargetPosition, 100);
      }
    } else {
      if (currentStep < phase2Steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setTimeout(updateTargetPosition, 100);
      } else {
        handleSkipAll();
      }
    }
  };

  const handlePrevious = () => {
    if (phase === 2 && currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimeout(updateTargetPosition, 100);
    } else if (phase === 2 && currentStep === 0) {
      setPhase(1);
      setCurrentStep(phase1Steps.length - 1);
    }
  };

  const handleCreate = () => {
    handleSkipAll();
    router.push("/templates-landing");
  };

  const getTooltipPosition = () => {
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    const tooltipWidth = 360;
    const tooltipHeight = 180;
    const offset = 20;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let top = targetRect.bottom + offset;
    let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

    if (top + tooltipHeight > windowHeight - 20) {
      top = targetRect.top - tooltipHeight - offset;
    }
    if (left < 20) left = 20;
    if (left + tooltipWidth > windowWidth - 20) left = windowWidth - tooltipWidth - 20;

    return { top: `${top}px`, left: `${left}px` };
  };

  if (!isVisible) return null;

  if (phase === 1) {
    const step = phase1Steps[currentStep];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleSkipAll} />

        <div className="relative w-full max-w-md bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl shadow-2xl border border-zinc-700/50 overflow-hidden">
          <div className="relative h-44 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-white/60 transition-all duration-500" style={{ width: `${((currentStep + 1) / phase1Steps.length) * 100}%` }} />
            </div>
            <div className="text-7xl animate-bounce">{step.icon}</div>
            <button onClick={handleSkipAll} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-7">
            <div className="flex justify-center gap-2 mb-5">
              {phase1Steps.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? "w-8 bg-indigo-500" : idx < currentStep ? "w-2 bg-indigo-500/50" : "w-2 bg-zinc-700"}`} />
              ))}
            </div>

            <h2 className="text-xl font-bold text-white text-center mb-3">{step.title}</h2>
            <p className="text-zinc-400 text-center mb-6 leading-relaxed">{step.description}</p>

            <div className="flex items-center justify-between gap-3">
              {currentStep > 0 ? (
                <button onClick={() => setCurrentStep(currentStep - 1)} className="flex-1 py-3 px-5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-colors">
                  {t("previous")}
                </button>
              ) : (
                <button onClick={handleSkipAll} className="flex-1 py-3 px-5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-colors">
                  {t("skip")}
                </button>
              )}

              <button onClick={handleNext} className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all shadow-lg shadow-indigo-500/25">
                {currentStep === phase1Steps.length - 1 ? t("finish") : t("next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const step = phase2Steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleSkipAll} />

      {targetRect && (
        <>
          <div className="absolute border-4 border-emerald-500 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-all duration-300" style={{ top: `${targetRect.top - 6}px`, left: `${targetRect.left - 6}px`, width: `${targetRect.width + 12}px`, height: `${targetRect.height + 12}px` }} />
          
          <div className="absolute w-0 h-0 border-l-[12px] border-l-emerald-500 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent transition-all duration-300" style={{ top: `${targetRect.top - 16}px`, left: `${targetRect.left + targetRect.width / 2 - 12}px` }} />
        </>
      )}

      <div className="absolute bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl shadow-2xl border border-emerald-600/50 p-5 w-[370px] transition-all duration-300 z-10" style={getTooltipPosition()}>
        <div className="absolute -top-2 left-6 px-3 py-1 bg-emerald-500 rounded-full text-white text-xs font-bold">
          {language === "ar" ? "خطوة" : language === "en" ? "Step" : "Étape"} {currentStep + 1}/{phase2Steps.length}
        </div>

        <div className="mt-2">
          <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
          <p className="text-emerald-200 text-sm leading-relaxed mb-4">{step.description}</p>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button onClick={handlePrevious} className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium transition-colors">
                ← {t("previous")}
              </button>
            )}
            
            {step.isLast ? (
              <button onClick={handleCreate} className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-all text-center">
                📄 {language === "ar" ? "إنشاء الآن" : language === "en" ? "Create Now" : "Créer maintenant"}
              </button>
            ) : (
              <button onClick={handleNext} className="flex-1 py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors text-center">
                {t("next")} →
              </button>
            )}
          </div>
        </div>

        <button onClick={handleSkipAll} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
