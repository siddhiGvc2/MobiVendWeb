import React from "react";
import { useEffect } from "react";
import { useSettings } from "./SettingsContext"; // Import useSettings
import { Link } from "react-router-dom";

const SettingsScreen = () => {
  const { settings, setSettings } = useSettings(); // Destructure setSettings

  const handleChange = (e) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [e.target.name]: e.target.value,
    }));
  
    setTimeout(() => {
      if (e.target.name === "Formula" && e.target.value === "1") {
        console.log("Formula is 1");
        setSettings((prevSettings) => ({
          ...prevSettings,
          MinLength: "24",
          Formula: "1",
        }));
      }
    }, 100);
  };

    useEffect(() => {
      localStorage.setItem("app_settings", JSON.stringify(settings));
    }, [settings]);

    

  return (
    <div style={styles.container}>
      <h2>Settings</h2>

      <label>Unit Number:</label>
      <input
        type="text"
        name="UnitNumber"
        value={settings.UnitNumber}
        onChange={handleChange}
        style={styles.input}
      />

      <label>Minimum Length:</label>
      <input
        type="number"
        name="MinLength"
        value={settings.MinLength}
        onChange={handleChange}
        style={styles.input}
      />

      <label>API:</label>
      <input
        type="text"
        name="Api"
        value={settings.Api}
        onChange={handleChange}
        style={styles.input}
      />

      <label>Formula:</label>
      <input
        type="text"
        name="Formula"
        value={settings.Formula}
        onChange={handleChange}
        style={styles.input}
      />

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
  },
  input: {
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
