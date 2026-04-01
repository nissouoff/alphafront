"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

interface OnboardingProps {
  onComplete: () => void;
}

interface GuideStep {
  id: string;
  selector: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [phase, setPhase] = useState<1 | 2>(1);
  const [highlightEl, setHighlightEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    const createStarted = localStorage.getItem("onboarding_create_started");

    if (!completed) {
      setPhase(1);
      setTimeout(() => setIsVisible(true), 500);
    } else if (!createStarted) {
      setPhase(2);
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  useEffect(() => {
    if (isVisible && phase === 2) {
      updateTargetPosition();
    }
  }, [isVisible, currentStep, phase]);

  const updateTargetPosition = () => {
    const step = phase2Steps[currentStep];
    if (step) {
      const el = document.querySelector(step.selector);
      if (el) {
        setHighlightEl(el as HTMLElement);
        setTargetRect(el.getBoundingClientRect());
      }
    }
  };

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

  const phase2Steps: GuideStep[] = [
    {
      id: "landing-section",
      selector: "[data-guide='create-landing']",
      title: t("onboarding2Title1"),
      description: t("onboarding2Desc1"),
      position: "bottom",
    },
    {
      id: "click-create",
      selector: "[data-guide='create-landing-btn']",
      title: t("onboarding2Step2"),
      description: t("onboarding2Step2Desc"),
      position: "right",
    },
  ];

  const handleCompletePhase1 = () => {
    localStorage.setItem("onboarding_completed", "true");
    setPhase(2);
    setCurrentStep(0);
    setTimeout(() => {
      updateTargetPosition();
    }, 100);
  };

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
        handleCompletePhase1();
      }
    } else {
      if (currentStep < phase2Steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSkipAll();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (phase === 2) {
      setPhase(1);
      setCurrentStep(phase1Steps.length - 1);
    }
  };

  const handleCreateLanding = () => {
    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("onboarding_create_started", "true");
    setIsVisible(false);
    onComplete();
    router.push("/templates-landing");
  };

  const handleCreateBoutique = () => {
    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("onboarding_create_started", "true");
    setIsVisible(false);
    onComplete();
    router.push("/templates");
  };

  if (!isVisible) return null;

  if (phase === 1) {
    const step = phase1Steps[currentStep];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleSkipAll} />

        <div className="relative w-full max-w-md bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl shadow-2xl border border-zinc-700/50 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-white/60 transition-all duration-500" style={{ width: `${((currentStep + 1) / phase1Steps.length) * 100}%` }} />
            </div>
            <div className="text-8xl animate-bounce">{step.icon}</div>
            <button onClick={handleSkipAll} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-8">
            <div className="flex justify-center gap-2 mb-6">
              {phase1Steps.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? "w-8 bg-indigo-500" : idx < currentStep ? "w-2 bg-indigo-500/50" : "w-2 bg-zinc-700"}`} />
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-3">{step.title}</h2>
            <p className="text-zinc-400 text-center mb-8 leading-relaxed">{step.description}</p>

            <div className="flex items-center justify-between gap-4">
              {currentStep > 0 ? (
                <button onClick={handlePrevious} className="flex-1 py-3 px-6 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t("previous")}
                </button>
              ) : (
                <button onClick={handleSkipAll} className="flex-1 py-3 px-6 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-colors">
                  {t("skip")}
                </button>
              )}

              <button onClick={handleNext} className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
                {currentStep === phase1Steps.length - 1 ? (
                  <>
                    {t("finish")}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    {t("next")}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="px-8 pb-6 flex justify-center">
            <button onClick={handleSkipAll} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              {language === "ar" ? "تم" : language === "en" ? "Done" : "Terminé"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const step = phase2Steps[currentStep];

  const getTooltipPosition = () => {
    if (!targetRect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    const tooltipWidth = 380;
    const tooltipHeight = 220;
    const offset = 20;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    switch (step.position) {
      case "top":
        top = targetRect.top - tooltipHeight - offset;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        if (top < 10) {
          top = targetRect.bottom + offset;
          left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        }
        break;
      case "bottom":
        top = targetRect.bottom + offset;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        if (top + tooltipHeight > windowHeight - 10) {
          top = targetRect.top - tooltipHeight - offset;
        }
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left - tooltipWidth - offset;
        if (left < 10) {
          left = targetRect.right + offset;
        }
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.right + offset;
        if (left + tooltipWidth > windowWidth - 10) {
          left = targetRect.left - tooltipWidth - offset;
        }
        break;
    }

    left = Math.max(10, Math.min(left, windowWidth - tooltipWidth - 10));
    top = Math.max(10, Math.min(top, windowHeight - tooltipHeight - 10));

    return { top: `${top}px`, left: `${left}px` };
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSkipAll} />

      {targetRect && highlightEl && (
        <div
          className="absolute border-4 border-indigo-500 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] transition-all duration-300"
          style={{
            top: `${targetRect.top - 8}px`,
            left: `${targetRect.left - 8}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
          }}
        />
      )}

      <div
        className="absolute w-96 bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl shadow-2xl border border-emerald-600/50 p-5 transition-all duration-300 z-10"
        style={getTooltipPosition()}
      >
        <div className="absolute -top-3 left-8 px-3 py-1 bg-emerald-500 rounded-full text-white text-xs font-bold">
          {language === "ar" ? "خطوة" : language === "en" ? "Step" : "Étape"} {currentStep + 1}/{phase2Steps.length}
        </div>

        {currentStep === 0 && (
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="w-8 h-8 bg-emerald-500 rotate-45 animate-bounce"></div>
          </div>
        )}

        <h3 className="text-xl font-bold text-white mt-2 mb-2">{step.title}</h3>
        <p className="text-emerald-200 text-sm mb-5 leading-relaxed">{step.description}</p>

        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <button onClick={handlePrevious} className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t("previous")}
            </button>
          )}

          {currentStep === phase2Steps.length - 1 ? (
            <div className="flex-1 flex gap-2">
              <button onClick={handleCreateBoutique} className="flex-1 py-2 px-4 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium transition-colors">
                🏪 {language === "ar" ? "متجر" : language === "en" ? "Shop" : "Boutique"}
              </button>
              <button onClick={handleCreateLanding} className="flex-1 py-2 px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                📄 {language === "ar" ? "صفحة هبوط" : language === "en" ? "Landing" : "Landing"}
              </button>
            </div>
          ) : (
            <button onClick={handleNext} className="flex-1 py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              {t("next")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        <button onClick={handleSkipAll} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
