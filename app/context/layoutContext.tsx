"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
    isLayoutVisible: boolean;
    setIsLayoutVisible: (visible: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
    const [isLayoutVisible, setIsLayoutVisible] = useState(true);

    return (
        <LayoutContext.Provider value={{ isLayoutVisible, setIsLayoutVisible }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) throw new Error("useLayout must be used within a LayoutProvider");
    return context;
};
