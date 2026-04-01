"use client";

import { useState, useEffect } from "react";
import { Joyride, Step, CallBackProps, STATUS, EVENTS } from "react-joyride";
import { useLanguage } from "@/context/LanguageContext";

export default function OnboardingTour() {
  const { t, language } = useLanguage();
  const [run, setRun] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("joyride_landing_created");
    if (!completed) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: "[data-tour='landing-create-btn']",
      content: (
        <div className="p-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-xl">🚀</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {language === "ar" ? "أنشئ صفحتك الأولى!" : 
                 language === "en" ? "Create your first page!" : 
                 "Créez votre première page !"}
              </h3>
              <p className="text-indigo-200 text-xs">
                {language === "ar" ? "ابدأ الآن" : 
                 language === "en" ? "Start now" : 
                 "Commencez maintenant"}
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

    if (status === STATUS.FINISHED || type === EVENTS.TOOLTIP_OPEN) {
      localStorage.setItem("joyride_landing_created", "true");
      setRun(false);
    }
  };

  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={false}
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
        last: language === "ar" ? "إنشاء الآن" : language === "en" ? "Create Now" : "Créer maintenant",
        next: "",
        skip: "",
      }}
    />
  );
}
