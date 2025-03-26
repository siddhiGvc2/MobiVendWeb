import React, { lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "./SettingsContext"; // Import useSettings
import "./HomeScreen.css"; // Import CSS file

const HomeScreen = () => {
  const navigate = useNavigate(); // For navigation
  const { settings } = useSettings(); // Access global settings
  const [text, setText] = useState("");
  const [updateText, setUpdateText] = useState("");

  const handleChange = (value) => {
    if (value.length <= parseInt(settings.MinLength)) {
      setText(value);
    }
  };

  useEffect(() => {
    
    if (text.length === parseInt(settings.MinLength)) {
      if(settings.Formula=="1")
      {
        const last5char=text.slice(-5);
        const hexValue = last5char;
        console.log('Received calculateNumber:', hexValue);
      
        if (!hexValue) {
          return;
        }
      
        // Step 1: Convert hex to decimal
        const initialDecimal = parseInt(hexValue, 16);
      
        if (isNaN(initialDecimal)) {
          return;
        }
      
        // Step 2: Divide by 2
        const dividedDecimal = Math.floor(initialDecimal / 2);
      
        // Step 3: Get last 4 hex digits
        const hexAfterDivide = dividedDecimal.toString(16); // e.g., '11911'
        const last4HexDigits = hexAfterDivide.slice(-4);    // e.g., '1911'
      
        // Step 4: Convert last 4 hex digits to decimal
        const finalDecimal = parseInt(last4HexDigits, 16);
        const value = finalDecimal % 65536;

      
          
        const url = `https://mobivend.in/rfid/scan?location_id=${settings.UnitNumber}&card_no=${value}`;
        setUpdateText(url);
        setTimeout(()=>{
        setUpdateText("Fetching data..."); // Show a loading message
      
     

      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.text();
        })
        .then((responseText) => {
          try {
            const jsonResponse = JSON.parse(responseText);
            setUpdateText(JSON.stringify(jsonResponse, null, 2));
          } catch (error) {
            setUpdateText(responseText);
          }
        })
        .catch((err) => {
          console.error(err);
          setUpdateText(`Error: ${err.message}`);
        });
      },2000);
         
      
    
    }
    else{
      const url = `https://mobivend.in/rfid/scan?location_id=${settings.UnitNumber}&card_no=${text}`;
      setUpdateText(url);
      setTimeout(()=>{
      setUpdateText("Fetching data..."); // Show a loading message
    
   

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.text();
      })
      .then((responseText) => {
        try {
          const jsonResponse = JSON.parse(responseText);
          setUpdateText(JSON.stringify(jsonResponse, null, 2));
        } catch (error) {
          setUpdateText(responseText);
        }
      })
      .catch((err) => {
        console.error(err);
        setUpdateText(`Error: ${err.message}`);
      });
    },2000);

    }
    }
  }, [text]);


  return (
    <div className="container">
      {/* Settings Button */}
      <button className="settings-button" onClick={() => navigate("/settings")}>
        ⚙ Settings
      </button>

      {/* Text Input */}
      <input
        autoFocus
        className="input"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter..."
        type="text"
      />

      {/* Response View */}
      <div className="response-container">
        <pre className="response-text">{updateText}</pre>
      </div>
    </div>
  );
};

export default HomeScreen;
