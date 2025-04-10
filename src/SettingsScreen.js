import React, { useEffect } from "react";
import { useSettings } from "./SettingsContext"; // Import useSettings
import { Link } from "react-router-dom";

const SettingsScreen = () => {
  const { settings, setSettings } = useSettings(); // Access settings & update function

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prevSettings) => {
      const newSettings = { ...prevSettings, [name]: value };

      // If Formula is set to "1", force MinLength to "24"
      if (name === "MinLength" && (value === "2" || value=="3")) {
        newSettings.Formula = "1";
      }
      else if(name === "MinLength" && value === "1"){
        newSettings.Formula = "";
      }

      return newSettings;
    });
  };

  // Ensure settings persist in IndexedDB
  useEffect(() => {
    console.log("Settings updated:", settings);
  }, [settings]);

  return (
    <div style={styles.container}>
      <h2 style={styles.label}>Settings</h2>

      <label style={styles.label}>Unit Number:</label>
      <input
        type="text"
        name="UnitNumber"
        value={settings.UnitNumber}
        onChange={handleChange}
        style={styles.input}
      />

      <label style={styles.label}>Minimum Length:</label>
      <select 
        name="MinLength" 
        value={settings.MinLength} 
        onChange={handleChange} 
        style={styles.input}
      >
        <option value="">Select an option</option>
        <option value="1">BAR CODE</option>
        <option value="2">HID ORIGINAL</option>
        <option value="3">HID 5 DIGIT</option>
      </select>
      {/* <input
        type="number"
        name="MinLength"
        value={settings.MinLength}
        onChange={handleChange}
        style={styles.input}
       
      /> */}

      {/* <label>API:</label>
      <input
        type="text"
        name="Api"
        value={settings.Api}
        onChange={handleChange}
        style={styles.input}
      /> */}

      {/* <label style={styles.label}>Formula:</label>
      <input
        type="text"
        name="Formula"
        value={settings.Formula}
        onChange={handleChange}
        style={styles.input}
      /> */}

      <Link to="/" style={styles.button}>Save & Go Back</Link>
    </div>
  );
};

const styles = {
  container: {
  
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #2c3e50, #3498db)", // Corrected (no semicolon)
  },
  label:{
    color:'#ccc'
  },
  input: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    padding: "8px",
    margin: "5px 0",
    width: "80%",
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    textDecoration: "none",
    background: "blue",
    color: "white",
    fontSize: "18px",
    borderRadius: "5px",
  },
};

export default SettingsScreen;
