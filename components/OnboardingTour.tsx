"use client";

import { useState, useEffect } from "react";
import { Joyride, Step, CallBackProps, STATUS, EVENTS } from "react-joyride";
import { useLanguage } from "@/context/LanguageContext";

export default function OnboardingTour() {
  const { language } = useLanguage();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const completed = localStorage.getItem("joyride_completed");
    if (!completed) {
      setRun(true);
    }
  }, []);

  if (!mounted) return null;

  const steps: Step[] = [
    {
      target: "[data-tour='sidebar-landings']",
      content: (
        <div className="p-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {language === "ar" ? "مرحباً بك!" : 
                 language === "en" ? "Welcome!" : 
                 "Bienvenue !"}
              </h3>
              <p className="text-indigo-300 text-xs">
                {language === "ar" ? "دعنا نبدأ" : 
                 language === "en" ? "Let's get started" : 
                 "Commençons"}
              </p>
            </div>
          </div>
          
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 mb-3">
            <p className="text-indigo-100 text-sm font-medium flex items-center gap-2">
              <span className="text-lg">👈</span>
              {language === "ar" ? "انقر على الزر في القائمة الجانبية" : 
               language === "en" ? "Click the button in the sidebar" : 
               "Cliquez sur le bouton dans le menu latéral"}
            </p>
          </div>
          
          <p className="text-zinc-400 text-sm leading-relaxed">
            {language === "ar" ? 
              "هذا الزر يفتح صفحة Landing Pages حيث يمكنك إنشاء صفحات الهبوط الأولى." : 
             language === "en" ? 
              "This button opens the Landing Pages section where you can create your landing pages." : 
              "Ce bouton ouvre la section Landing Pages où vous pourrez créer vos pages de vente."}
          </p>
          
          <div className="mt-4 pt-3 border-t border-zinc-700 flex items-center justify-between">
            <span className="text-xs text-indigo-400 font-medium">
              {language === "ar" ? "الخطوة 1 من 2" : 
               language === "en" ? "Step 1 of 2" : 
               "Étape 1 sur 2"}
            </span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
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
        <div className="p-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {language === "ar" ? "أنشئ صفحتك!" : 
                 language === "en" ? "Create your page!" : 
                 "Créez votre page !"}
              </h3>
              <p className="text-emerald-300 text-xs">
                {language === "ar" ? "على بعد خطوة واحدة" : 
                 language === "en" ? "One step away" : 
                 "À un pas du but"}
              </p>
            </div>
          </div>
          
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-3">
            <p className="text-emerald-100 text-sm font-medium flex items-center gap-2">
              <span className="text-lg">👇</span>
              {language === "ar" ? "انقر على الزر أدناه" : 
               language === "en" ? "Click the button below" : 
               "Cliquez sur le bouton ci-dessous"}
            </p>
          </div>
          
          <p className="text-zinc-400 text-sm leading-relaxed">
            {language === "ar" ? 
              "هذا الزر يفتح معالج إنشاء صفحة الهبوط. اختر قالباً وابدأ البيع!" : 
             language === "en" ? 
              "This button opens the landing page creator. Choose a template and start selling!" : 
              "Ce bouton ouvre l'éditeur de landing page. Choisissez un template et commencez à vendre !"}
          </p>
          
          <div className="mt-4 pt-3 border-t border-zinc-700 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-medium">
              {language === "ar" ? "الخطوة 2 من 2" : 
               language === "en" ? "Step 2 of 2" : 
               "Étape 2 sur 2"}
            </span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
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
      disableScrolling={true}
      hideBackButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: "#1e293b",
          overlayColor: "rgba(0, 0, 0, 0.88)",
          spotlightShadow: "0 0 0 4px rgba(99, 102, 241, 1), 0 0 20px rgba(99, 102, 241, 0.5)",
          zIndex: 10000,
          beaconSize: 0,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.88)",
        },
        spotlight: {
          borderRadius: 8,
        },
        tooltip: {
          backgroundColor: "#1e293b",
          borderRadius: 16,
          padding: 0,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "#6366f1",
          borderRadius: 8,
          color: "#fff",
          fontWeight: 600,
          padding: "10px 24px",
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
        next: language === "ar" ? "التالي ←" : language === "en" ? "Next ←" : "Suivant ←",
        skip: "",
      }}
      floaterProps={{
        disableAnimation: true,
        alwaysVisible: false,
      }}
      beaconComponent={() => null}
    />
  );
}
