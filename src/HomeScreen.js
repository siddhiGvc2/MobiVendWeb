import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "./SettingsContext"; // Import useSettings
import "./HomeScreen.css"; // Import CSS file

const HomeScreen = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [text, setText] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleChange = (value) => {
    let length=0;
    if(settings.MinLength=="1")
    {
      length=8;
    }
    else if(settings.MinLength=="2"){
      length=24;
    }
    setText(value);

    // Clear previous timeout and set a new one
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
   
    const newTimeout = setTimeout(() => {
      if(value.length>=length)
      {
      callApi(value);
      }
      else{
        setUpdateText(`Minimum Length should ${length}`);
      }
    }, settings.Timeout ? parseInt(settings.Timeout) * 1000 : 1200); // Default 2s if no timeout is set

    setTypingTimeout(newTimeout);
  };

  const callApi = (cardNumber) => {
    if (!cardNumber) return; // Don't call API if input is empty

    let url = `https://mobivend.in/rfid/scan?location_id=${settings.UnitNumber}&card_no=${cardNumber}`;

    if (settings.Formula === "1") {
      const last5char = cardNumber.slice(-5);
      console.log("Received calculateNumber:", last5char);

      const initialDecimal = parseInt(last5char, 16);
      if (!isNaN(initialDecimal)) {
        const dividedDecimal = Math.floor(initialDecimal / 2);
        const last4HexDigits = dividedDecimal.toString(16).slice(-4);
        cardNumber = parseInt(last4HexDigits, 16) % 65536;
      }

      url = `https://mobivend.in/rfid/scan?location_id=${settings.UnitNumber}&card_no=${cardNumber}`;
    }
    setText("");
    setUpdateText(url);
    setTimeout(()=>{
    setUpdateText("Fetching data...");

    const fetchTimeout = setTimeout(() => {
      setUpdateText("offline");
    }, 5000); // 5 seconds timeout

    fetch(url)
      .then((res) => {
        clearTimeout(fetchTimeout);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.text();
      })
      .then((responseText) => {
        try {
          setUpdateText(JSON.stringify(JSON.parse(responseText), null, 2));
        } catch {
          setUpdateText(responseText);
        }
      })
      .catch((err) => {
        console.error(err);
        setUpdateText(`Error: ${err.message}`);
      });
    },2000)
  };

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
