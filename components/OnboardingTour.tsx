"use client";

import { useState, useEffect } from "react";
import { Joyride, Step, CallBackProps, STATUS, EVENTS } from "react-joyride";
import { useLanguage } from "@/context/LanguageContext";

export default function OnboardingTour() {
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
        <div className="p-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-xl">👋</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {language === "ar" ? "مرحباً!" : 
                 language === "en" ? "Welcome!" : 
                 "Bienvenue !"}
              </h3>
              <p className="text-indigo-200 text-xs">
                {language === "ar" ? "ابدأ رحلتك" : 
                 language === "en" ? "Start your journey" : 
                 "Commençons votre parcours"}
              </p>
            </div>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            {language === "ar" ? 
              "انقر على 'Landing Pages' في القائمة الجانبية للبدء في إنشاء صفحة الهبوط الأولى." : 
             language === "en" ? 
              "Click on 'Landing Pages' in the sidebar to start creating your first landing page." : 
              "Cliquez sur 'Landing Pages' dans le menu latéral pour commencer à créer votre première landing page."}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-indigo-300">
              {language === "ar" ? "الخطوة 1 من 2" : 
               language === "en" ? "Step 1 of 2" : 
               "Étape 1 sur 2"}
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
            </div>
          </div>
        </div>
      ),
      placement: "right",
      disableBeacon: true,
      disableOverlayClose: true,
      spotlightClicks: true,
    },
    {
      target: "[data-tour='landing-create-btn']",
      content: (
        <div className="p-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-xl">🚀</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {language === "ar" ? "أنشئ صفحتك الأولى!" : 
                 language === "en" ? "Create your first page!" : 
                 "Créez votre première page !"}
              </h3>
              <p className="text-emerald-200 text-xs">
                {language === "ar" ? "على بعد خطوة واحدة" : 
                 language === "en" ? "One step away" : 
                 "À un pas du but"}
              </p>
            </div>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            {language === "ar" ? 
              "انقر على الزر أدناه لإنشاء صفحة الهبوط الأولى." : 
             language === "en" ? 
              "Click the button below to create your first landing page." : 
              "Cliquez sur le bouton ci-dessous pour créer votre première landing page."}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-emerald-300">
              {language === "ar" ? "الخطوة 2 من 2" : 
               language === "en" ? "Step 2 of 2" : 
               "Étape 2 sur 2"}
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>
        </div>
      ),
      placement: "bottom",
      disableBeacon: true,
      disableOverlayClose: true,
      spotlightClicks: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;

    if (status === STATUS.FINISHED) {
      localStorage.setItem("joyride_completed", "true");
      setRun(false);
    }

    if (type === EVENTS.STEP_AFTER) {
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
      showSkipButton={false}
      showProgress={false}
      disableOverlayClose={true}
      spotlightClicks={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: "#1e293b",
          overlayColor: "rgba(0, 0, 0, 0.85)",
          spotlightShadow: "0 0 0 3px rgba(99, 102, 241, 0.8)",
          zIndex: 10000,
          backdropBlur: 8,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.85)",
        },
        spotlight: {
          borderRadius: 8,
        },
        tooltip: {
          backgroundColor: "#1e293b",
          borderRadius: 16,
          padding: 0,
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "#6366f1",
          borderRadius: 8,
          color: "#fff",
          fontWeight: 600,
          padding: "10px 20px",
          fontSize: 14,
        },
        buttonBack: {
          display: "none",
        },
        tooltipFooter: {
          display: "none",
        },
        closeButton: {
          display: "none",
        },
      }}
      locale={{
        back: "",
        close: "",
        last: language === "ar" ? "إنهاء" : language === "en" ? "Finish" : "Terminer",
        next: language === "ar" ? "التالي →" : language === "en" ? "Next →" : "Suivant →",
        skip: "",
      }}
    />
  );
}
