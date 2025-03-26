import React, { createContext, useState, useEffect, useContext } from "react";

// Create Context
const SettingsContext = createContext();

// Provider Component
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage (if available)
    const savedSettings = localStorage.getItem("app_settings");
    return savedSettings ? JSON.parse(savedSettings) : {
      UnitNumber: "12345",
      MinLength: "5",
      Api: "",
      Formula: "0",
    };
  });
  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("app_settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom Hook to use Settings
export const useSettings = () => useContext(SettingsContext);
