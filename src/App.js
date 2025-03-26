import React from "react";
import { Routes,Route } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";

const App = () => {
  return (
 
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>

       
  );
};

export default App;
