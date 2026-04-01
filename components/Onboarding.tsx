"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface OnboardingStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingProps {
  steps: OnboardingStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function Onboarding({ steps, isOpen, onClose, onComplete }: OnboardingProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && steps.length > 0) {
      updateTargetPosition(steps[currentStep].target);
    }
  }, [isOpen, currentStep, steps]);

  const updateTargetPosition = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      setTargetRect(element.getBoundingClientRect());
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />
      
      {targetRect && (
        <div
          className="absolute border-2 border-indigo-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none transition-all duration-300"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />
      )}

      <div
        ref={tooltipRef}
        className="absolute bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-700 p-5 w-80 md:w-96 z-10 animate-in fade-in zoom-in-95 duration-200"
        style={{
          top: targetRect ? getTooltipPosition(step.position, targetRect).top : '50%',
          left: targetRect ? getTooltipPosition(step.position, targetRect).left : '50%',
          transform: targetRect ? 'none' : 'translate(-50%, -50%)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-700 rounded-t-2xl overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-4 mt-2">
          <span className="text-xs text-indigo-400 font-medium">
            {currentStep + 1} / {steps.length}
          </span>
          <h3 className="text-lg font-bold text-white mt-1">{step.title}</h3>
          <p className="text-sm text-zinc-400 mt-2">{step.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleSkip}
            className="px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            {t('skip') || 'Passer'}
          </button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 text-sm bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
              >
                ←
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  {t('finish') || 'Terminer'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              ) : (
                <>
                  {t('next') || 'Suivant'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-4">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentStep ? 'bg-indigo-500' : 'bg-zinc-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function getTooltipPosition(position: string, rect: DOMRect) {
  const tooltipWidth = 384;
  const tooltipHeight = 200;
  const offset = 16;

  switch (position) {
    case 'top':
      return {
        top: rect.top - tooltipHeight - offset,
        left: rect.left + rect.width / 2 - tooltipWidth / 2,
      };
    case 'bottom':
      return {
        top: rect.bottom + offset,
        left: rect.left + rect.width / 2 - tooltipWidth / 2,
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2 - tooltipHeight / 2,
        left: rect.left - tooltipWidth - offset,
      };
    case 'right':
      return {
        top: rect.top + rect.height / 2 - tooltipHeight / 2,
        left: rect.right + offset,
      };
    default:
      return {
        top: rect.bottom + offset,
        left: rect.left + rect.width / 2 - tooltipWidth / 2,
      };
  }
}
