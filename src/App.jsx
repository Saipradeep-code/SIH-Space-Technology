import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // -----------------------------
  // BACKEND CONNECTION TEST
  // -----------------------------
  const testBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/status");

      if (!response.ok) {
        throw new Error("Backend response failed");
      }

      const data = await response.json();

      console.log("Backend data:", data);

      alert("Backend Connected! Health: " + data.health);
    } catch (error) {
      console.error(error);
      alert("Backend NOT connected!");
    }
  };

  // -----------------------------
  // FRONTEND STATE
  // -----------------------------
  const [failure, setFailure] = useState("normal");

  const [telemetry, setTelemetry] = useState({
    solar: 95,
    voltage: 28.4,
    temperature: 31,
    signal: 92,
    cpu: 42,
  });

  // -----------------------------
  // SIMULATE TELEMETRY
  // -----------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        let updated = { ...prev };

        // NORMAL MODE
        if (failure === "normal") {
          updated.solar = Math.max(
            85,
            Math.min(100, prev.solar + Math.random() * 4 - 2)
          );

          updated.voltage = Math.max(
            27,
            Math.min(29, prev.voltage + Math.random() * 0.4 - 0.2)
          );

          updated.temperature = Math.max(
            28,
            Math.min(36, prev.temperature + Math.random() * 2 - 1)
          );

          updated.signal = Math.max(
            80,
            Math.min(100, prev.signal + Math.random() * 6 - 3)
          );

          updated.cpu = Math.max(
            25,
            Math.min(60, prev.cpu + Math.random() * 8 - 4)
          );
        }

        // SOLAR FAILURE
        if (failure === "solar") {
          updated.solar = Math.max(20, prev.solar - 3);
          updated.voltage = Math.max(20, prev.voltage - 0.15);
          updated.temperature = Math.min(65, prev.temperature + 0.5);
        }

        // BATTERY FAILURE
        if (failure === "battery") {
          updated.temperature = Math.min(80, prev.temperature + 2);
          updated.voltage = Math.max(20, prev.voltage - 0.2);
        }

        // COMMUNICATION FAILURE
        if (failure === "communication") {
          updated.signal = Math.max(5, prev.signal - 6);
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [failure]);

  // -----------------------------
  // CALCULATE HEALTH SCORE
  // -----------------------------
  function calculateHealth() {
    let health = 100;

    if (telemetry.solar < 80) {
      health -= 80 - telemetry.solar;
    }

    if (telemetry.voltage < 27) {
      health -= (27 - telemetry.voltage) * 8;
    }

    if (telemetry.temperature > 40) {
      health -= (telemetry.temperature - 40) * 1.5;
    }

    if (telemetry.signal < 70) {
      health -= 70 - telemetry.signal;
    }

    return Math.max(0, Math.min(100, Math.round(health)));
  }

  const health = calculateHealth();

  // -----------------------------
  // RESET SATELLITE
  // -----------------------------
  function resetSatellite() {
    setFailure("normal");

    setTelemetry({
      solar: 95,
      voltage: 28.4,
      temperature: 31,
      signal: 92,
      cpu: 42,
    });
  }

  // -----------------------------
  // ANOMALY DETECTION
  // -----------------------------
  function getAnomaly() {
    if (telemetry.solar < 70) {
      return {
        title: "POWER SYSTEM ANOMALY",
        message:
          "Solar panel power generation is critically decreasing.",
        severity: "CRITICAL",
        actions: [
          "Enable low-power mode",
          "Reduce payload operations",
          "Monitor battery voltage",
        ],
      };
    }

    if (telemetry.temperature > 50) {
      return {
        title: "THERMAL ANOMALY",
        message:
          "Battery temperature has exceeded the safe operating range.",
        severity: "CRITICAL",
        actions: [
          "Reduce power consumption",
          "Disable non-essential payloads",
          "Activate thermal protection",
        ],
      };
    }

    if (telemetry.signal < 50) {
      return {
        title: "COMMUNICATION ANOMALY",
        message:
          "Satellite communication signal is critically weak.",
        severity: "HIGH",
        actions: [
          "Switch to backup communication channel",
          "Check antenna orientation",
          "Reduce transmission load",
        ],
      };
    }

    return null;
  }

  const anomaly = getAnomaly();

  // -----------------------------
  // WEBSITE UI
  // -----------------------------
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>🛰️ SATGUARD AI</h1>
          <p>AI-Powered Satellite Health Monitoring System</p>
        </div>

        <div className="live-status">
          <span className="live-dot"></span>
          LIVE
        </div>
      </header>

      <main>
        {/* BACKEND TEST */}
        <div style={{ marginBottom: "20px" }}>
          <button className="reset" onClick={testBackend}>
            🔗 Test Backend Connection
          </button>
        </div>

        {/* HEALTH + SATELLITE INFO */}
        <section className="hero-grid">
          <div className="card health-card">
            <p className="label">OVERALL SATELLITE HEALTH</p>

            <h2 className="health-score">
              {health}
              <span>/100</span>
            </h2>

            <p
              className={
                health >= 80
                  ? "healthy"
                  : health >= 50
                  ? "warning"
                  : "critical"
              }
            >
              {health >= 80
                ? "● HEALTHY"
                : health >= 50
                ? "● WARNING"
                : "● CRITICAL"}
            </p>
          </div>

          <div className="card">
            <h2>SATGUARD-1</h2>

            <p>
              <b>Mission:</b> Earth Observation
            </p>

            <p>
              <b>Orbit:</b> Low Earth Orbit
            </p>

            <p>
              <b>Telemetry:</b> Active
            </p>

            <p className="healthy">● SYSTEM ONLINE</p>
          </div>
        </section>

        {/* TELEMETRY */}
        <h2 className="section-title">LIVE TELEMETRY</h2>

        <section className="telemetry-grid">
          <TelemetryCard
            icon="☀️"
            title="Solar Output"
            value={`${telemetry.solar.toFixed(1)}%`}
          />

          <TelemetryCard
            icon="🔋"
            title="Battery Voltage"
            value={`${telemetry.voltage.toFixed(2)} V`}
          />

          <TelemetryCard
            icon="🌡️"
            title="Battery Temperature"
            value={`${telemetry.temperature.toFixed(1)} °C`}
          />

          <TelemetryCard
            icon="📡"
            title="Signal Strength"
            value={`${telemetry.signal.toFixed(1)}%`}
          />

          <TelemetryCard
            icon="💻"
            title="CPU Usage"
            value={`${telemetry.cpu.toFixed(1)}%`}
          />
        </section>

        {/* FAILURE BUTTONS */}
        <h2 className="section-title">FAILURE SIMULATION</h2>

        <div className="button-grid">
          <button
            className="danger"
            onClick={() => setFailure("solar")}
          >
            ⚡ Solar Panel Failure
          </button>

          <button
            className="danger"
            onClick={() => setFailure("battery")}
          >
            🌡️ Battery Overheating
          </button>

          <button
            className="danger"
            onClick={() => setFailure("communication")}
          >
            📡 Communication Failure
          </button>

          <button className="reset" onClick={resetSatellite}>
            🔄 Reset Satellite
          </button>
        </div>

        {/* AI ANALYSIS */}
        <h2 className="section-title">AI HEALTH ANALYSIS</h2>

        {!anomaly ? (
          <div className="card normal-panel">
            <h2>🟢 Satellite Operating Normally</h2>

            <p>
              No critical anomalies have been detected. All major
              satellite subsystems are operating within safe limits.
            </p>
          </div>
        ) : (
          <div className="anomaly-container">
            <div className="card anomaly-card">
              <h2>🚨 {anomaly.title}</h2>

              <p>
                <b>Severity:</b> {anomaly.severity}
              </p>

              <p>{anomaly.message}</p>
            </div>

            <div className="card">
              <h2>🧠 Recommended Actions</h2>

              {anomaly.actions.map((action, index) => (
                <p key={index}>✓ {action}</p>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// -----------------------------------
// TELEMETRY CARD COMPONENT
// -----------------------------------

function TelemetryCard({ icon, title, value }) {
  return (
    <div className="card telemetry-card">
      <div className="telemetry-icon">{icon}</div>

      <div>
        <p className="label">{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default App;