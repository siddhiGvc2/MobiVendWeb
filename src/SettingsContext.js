import React, { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

const defaultSettings = {
  UnitNumber: "12345",
  MinLength: "5",
  Api: "",
  Formula: "0",
};

// Open IndexedDB (Ensures database is ready)
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AppDatabase", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Function to get settings from IndexedDB
const getSettingsFromDB = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction("settings", "readonly");
      const store = transaction.objectStore("settings");
      const getRequest = store.get(1);

      getRequest.onsuccess = () => {
        resolve(getRequest.result ? getRequest.result.data : defaultSettings);
      };
      getRequest.onerror = () => resolve(defaultSettings);
    });
  } catch (error) {
    console.error("IndexedDB Error:", error);
    return defaultSettings;
  }
};

// Function to save settings to IndexedDB
const saveSettingsToDB = async (settings) => {
  try {
    const db = await openDB();
    const transaction = db.transaction("settings", "readwrite");
    const store = transaction.objectStore("settings");
    store.put({ id: 1, data: settings });
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  // Load settings on startup
  useEffect(() => {
    getSettingsFromDB().then(setSettings);
  }, []);

  // Save settings to IndexedDB whenever they change
  useEffect(() => {
    if (settings !== defaultSettings) {
      saveSettingsToDB(settings);
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
