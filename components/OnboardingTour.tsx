"use client";

import { useState, useEffect } from "react";
import { Joyride, Step, CallBackProps, STATUS } from "react-joyride";
import { useLanguage } from "@/context/LanguageContext";

interface OnboardingTourProps {
  onComplete?: () => void;
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const { t, language } = useLanguage();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem("joyride_completed");
    if (!completed) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: "[data-tour='sidebar-landings']",
      content: (
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">
            {language === "ar" ? "مرحباً بك في ShopLaunch!" : 
             language === "en" ? "Welcome to ShopLaunch!" : 
             "Bienvenue sur ShopLaunch !"}
          </h3>
          <p className="text-zinc-300 text-sm">
            {language === "ar" ? "انقر على 'Landing Pages' في القائمة للبدء." : 
             language === "en" ? "Click on 'Landing Pages' in the sidebar to get started." : 
             "Cliquez sur 'Landing Pages' dans le menu pour commencer."}
          </p>
        </div>
      ),
      placement: "right",
      disableBeacon: true,
    },
    {
      target: "[data-tour='landing-create-btn']",
      content: (
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">
            {language === "ar" ? "أنشئ صفحة الهبوط الأولى" : 
             language === "en" ? "Create your first Landing Page" : 
             "Créez votre première Landing Page"}
          </h3>
          <p className="text-zinc-300 text-sm">
            {language === "ar" ? "انقر على هذا الزر لإنشاء صفحة هبوط جديدة." : 
             language === "en" ? "Click this button to create a new landing page." : 
             "Cliquez sur ce bouton pour créer une nouvelle landing page."}
          </p>
        </div>
      ),
      placement: "bottom",
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, action } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED || action === "skip") {
      localStorage.setItem("joyride_completed", "true");
      setRun(false);
      onComplete?.();
    }

    if (type === "step:after" && action === "next") {
      setStepIndex((prev) => prev + 1);
    }
  };

  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      showProgress={false}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: "#1e293b",
          overlayColor: "rgba(0, 0, 0, 0.7)",
          spotlightShadow: "0 0 15px rgba(99, 102, 241, 0.8)",
          zIndex: 10000,
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "#6366f1",
          borderRadius: "0.5rem",
          color: "#fff",
          fontWeight: 600,
        },
        buttonBack: {
          color: "#a1a1aa",
          marginRight: "0.5rem",
        },
        buttonSkip: {
          color: "#71717a",
        },
      }}
      locale={{
        back: language === "ar" ? "السابق" : language === "en" ? "Back" : "Précédent",
        close: language === "ar" ? "إغلاق" : language === "en" ? "Close" : "Fermer",
        last: language === "ar" ? "إنهاء" : language === "en" ? "Finish" : "Terminer",
        next: language === "ar" ? "التالي" : language === "en" ? "Next" : "Suivant",
        skip: language === "ar" ? "تخطي" : language === "en" ? "Skip" : "Passer",
      }}
      floaterProps={{
        disableAnimation: false,
        spaProps: {
          hidden: true,
        },
      }}
    />
  );
}
