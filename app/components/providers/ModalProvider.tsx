"use client";

import { createContext, useContext, useState, useEffect } from "react";
import LeadModal, { type ModalType } from "@/app/components/ui/LeadModal";

interface ModalContextValue {
  openModal: (type: ModalType) => void;
}

const ModalContext = createContext<ModalContextValue>({ openModal: () => {} });

export function useModal() {
  return useContext(ModalContext);
}

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeType, setActiveType] = useState<ModalType | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (activeType) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }, [activeType]);

  return (
    <ModalContext.Provider value={{ openModal: setActiveType }}>
      {children}
      {activeType && (
        <LeadModal type={activeType} onClose={() => setActiveType(null)} />
      )}
    </ModalContext.Provider>
  );
}
