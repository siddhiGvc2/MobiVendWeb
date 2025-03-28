import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "./SettingsContext"; // Import useSettings
import "./HomeScreen.css"; // Import CSS file

const HomeScreen = () => {
  const navigate = useNavigate(); // For navigation
  const { settings } = useSettings(); // Access global settings
  const [text, setText] = useState("");
  const [updateText, setUpdateText] = useState("");

  const handleChange = (value) => {
    if (value.length <= parseInt(settings.MinLength, 10)) {
      setText(value);
    }
  };

  useEffect(() => {
    if (text.length !== parseInt(settings.MinLength, 10)) return;

    let cardNumber = text;
    let url = `https://mobivend.in/rfid/scan?location_id=${settings.UnitNumber}&card_no=${cardNumber}`;

    if (settings.Formula === "1") {
      const last5char = text.slice(-5);
      console.log("Received calculateNumber:", last5char);

      const initialDecimal = parseInt(last5char, 16);
      if (!isNaN(initialDecimal)) {
        const dividedDecimal = Math.floor(initialDecimal / 2);
        const last4HexDigits = dividedDecimal.toString(16).slice(-4);
        cardNumber = parseInt(last4HexDigits, 16) % 65536;
      }

      url = `https://mobivend.in/rfid/scan?location_id=${settings.UnitNumber}&card_no=${cardNumber}`;
    }

    setUpdateText(url);
    setTimeout(() => {
      setUpdateText("Fetching data...");

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.text();
        })
        .then((responseText) => {
          try {
            setText("");
            setUpdateText(JSON.stringify(JSON.parse(responseText), null, 2));
            setTimeout(()=>{
              setUpdateText("");
            },5000)
          } catch {
            setText("");
            setUpdateText(responseText);
            setTimeout(()=>{
              setUpdateText("");
            },5000)
          }
        })
        .catch((err) => {
          console.error(err);
          setText("");
          setUpdateText(`Error: ${err.message}`);
          setTimeout(()=>{
            setUpdateText("");
          },5000)
        });
    }, 2000);
  }, [text, settings]);

  return (
    <div className="container">
      <button className="settings-button" onClick={() => navigate("/settings")}>
        ⚙ Settings
      </button>

      <input
        autoFocus
        className="input"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter..."
        type="text"
      />

      <div className="response-container">
        <pre className="response-text">{updateText}</pre>
      </div>
    </div>
  );
};

export default HomeScreen;
