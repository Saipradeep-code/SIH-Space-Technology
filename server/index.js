const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let activeFailure = "normal";

let telemetry = {
  solar: 95,
  voltage: 28.4,
  temperature: 31,
  signal: 92,
  cpu: 42,
};

let history = [];


/* ---------------------------
   HEALTH CALCULATION
---------------------------- */

function calculateHealth() {
  let score = 100;

  if (telemetry.solar < 80) {
    score -= (80 - telemetry.solar) * 1;
  }

  if (telemetry.voltage < 27) {
    score -= (27 - telemetry.voltage) * 10;
  }

  if (telemetry.temperature > 40) {
    score -= (telemetry.temperature - 40) * 1.5;
  }

  if (telemetry.signal < 70) {
    score -= (70 - telemetry.signal) * 1;
  }

  return Math.max(0, Math.round(score));
}


/* ---------------------------
   ANOMALY DETECTION
---------------------------- */

function detectAnomaly() {

  if (telemetry.solar < 70) {
    return {
      detected: true,
      title: "POWER SYSTEM ANOMALY",
      cause: "Solar Panel Power Degradation",
      severity: "CRITICAL",

      cascade: [
        "Solar power generation decreases",
        "Battery begins discharging",
        "Battery voltage decreases",
        "Payload shutdown risk increases",
      ],

      actions: [
        "Enable low-power mode",
        "Reduce payload operations",
        "Monitor battery voltage",
      ],
    };
  }


  if (telemetry.temperature > 50) {
    return {
      detected: true,
      title: "THERMAL ANOMALY",
      cause: "Battery Overheating",

      severity: "CRITICAL",

      cascade: [
        "Battery temperature increases",
        "Battery efficiency decreases",
        "Voltage becomes unstable",
        "Subsystem shutdown risk increases",
      ],

      actions: [
        "Reduce power consumption",
        "Disable non-essential payloads",
        "Activate thermal protection mode",
      ],
    };
  }


  if (telemetry.signal < 50) {
    return {
      detected: true,
      title: "COMMUNICATION ANOMALY",
      cause: "Signal Degradation",

      severity: "HIGH",

      cascade: [
        "Signal strength decreases",
        "Packet loss increases",
        "Telemetry transmission becomes unstable",
        "Ground communication may be lost",
      ],

      actions: [
        "Switch to backup communication channel",
        "Reduce transmission load",
        "Check antenna orientation",
      ],
    };
  }


  return {
    detected: false,
    title: "SATELLITE HEALTHY",
    cause: "No anomaly detected",
    severity: "NORMAL",
    cascade: [],
    actions: [],
  };
}


/* ---------------------------
   TELEMETRY SIMULATOR
---------------------------- */

setInterval(() => {

  if (activeFailure === "normal") {

    telemetry.solar =
      Math.max(85, Math.min(100,
        telemetry.solar + Math.random() * 4 - 2
      ));

    telemetry.voltage =
      Math.max(27, Math.min(29,
        telemetry.voltage + Math.random() * 0.4 - 0.2
      ));

    telemetry.temperature =
      Math.max(28, Math.min(36,
        telemetry.temperature + Math.random() * 2 - 1
      ));

    telemetry.signal =
      Math.max(80, Math.min(100,
        telemetry.signal + Math.random() * 6 - 3
      ));

    telemetry.cpu =
      Math.max(25, Math.min(60,
        telemetry.cpu + Math.random() * 8 - 4
      ));
  }


  /* SOLAR FAILURE */

  if (activeFailure === "solar") {

    telemetry.solar =
      Math.max(20, telemetry.solar - 3);

    telemetry.voltage =
      Math.max(20, telemetry.voltage - 0.15);

    telemetry.temperature =
      Math.min(65, telemetry.temperature + 0.5);
  }


  /* BATTERY FAILURE */

  if (activeFailure === "battery") {

    telemetry.temperature =
      Math.min(80, telemetry.temperature + 2);

    telemetry.voltage =
      Math.max(20, telemetry.voltage - 0.2);
  }


  /* COMMUNICATION FAILURE */

  if (activeFailure === "communication") {

    telemetry.signal =
      Math.max(5, telemetry.signal - 6);
  }


  history.push({
    time: new Date().toLocaleTimeString(),

    solar: Number(telemetry.solar.toFixed(1)),

    temperature: Number(
      telemetry.temperature.toFixed(1)
    ),

    signal: Number(
      telemetry.signal.toFixed(1)
    ),
  });


  /* Keep only latest 30 records */

  if (history.length > 30) {
    history.shift();
  }

}, 1000);


/* ---------------------------
   API: GET SATELLITE STATUS
---------------------------- */

app.get("/api/status", (req, res) => {

  res.json({

    telemetry: {
      solar: Number(telemetry.solar.toFixed(1)),

      voltage: Number(telemetry.voltage.toFixed(2)),

      temperature: Number(
        telemetry.temperature.toFixed(1)
      ),

      signal: Number(telemetry.signal.toFixed(1)),

      cpu: Number(telemetry.cpu.toFixed(1)),
    },

    health: calculateHealth(),

    anomaly: detectAnomaly(),

    failure: activeFailure,

    history,
  });

});


/* ---------------------------
   API: TRIGGER FAILURE
---------------------------- */

app.post("/api/failure", (req, res) => {

  const { type } = req.body;

  const validFailures = [
    "normal",
    "solar",
    "battery",
    "communication",
  ];


  if (!validFailures.includes(type)) {

    return res.status(400).json({
      error: "Invalid failure type",
    });

  }


  activeFailure = type;


  res.json({
    message: `Failure changed to ${type}`,
  });

});


/* ---------------------------
   API: RESET SATELLITE
---------------------------- */

app.post("/api/reset", (req, res) => {

  activeFailure = "normal";


  telemetry = {
    solar: 95,
    voltage: 28.4,
    temperature: 31,
    signal: 92,
    cpu: 42,
  };


  history = [];


  res.json({
    message: "Satellite reset successfully",
  });

});


/* ---------------------------
   START SERVER
---------------------------- */

app.listen(5000, () => {

  console.log(
    "SATGUARD Backend running on http://localhost:5000"
  );

});