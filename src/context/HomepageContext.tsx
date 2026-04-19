'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HomepageState {
  hoveredSection: string | null;
  selectedSection: string | null;
  isFocused: boolean;
  setHoveredSection: (id: string | null) => void;
  setSelectedSection: (id: string | null) => void;
  setIsFocused: (focused: boolean) => void;
}

const HomepageContext = createContext<HomepageState | undefined>(undefined);

export function HomepageProvider({ children }: { children: ReactNode }) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <HomepageContext.Provider value={{
      hoveredSection,
      selectedSection,
      isFocused,
      setHoveredSection,
      setSelectedSection,
      setIsFocused,
    }}>
      {children}
    </HomepageContext.Provider>
  );
}

export function useHomepageState() {
  const context = useContext(HomepageContext);
  if (context === undefined) {
    throw new Error('useHomepageState must be used within a HomepageProvider');
  }
  return context;
}
