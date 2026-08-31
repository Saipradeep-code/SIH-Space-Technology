# 🛰️ SATGUARD AI
## Intelligent Satellite Health Monitoring & Anomaly Detection System

<p align="center">

<img src="https://img.shields.io/badge/SIH%202026-SATGUARD%20AI-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Theme-Space%20Technology-purple?style=for-the-badge" />
<img src="https://img.shields.io/badge/Category-Software-success?style=for-the-badge" />
<img src="https://img.shields.io/badge/Status-Prototype-orange?style=for-the-badge" />

</p>

<p align="center">

<img src="https://img.shields.io/badge/React.js-Frontend-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite" />
<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js" />
<img src="https://img.shields.io/badge/Express.js-REST%20API-black?style=for-the-badge&logo=express" />
<img src="https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python" />
<img src="https://img.shields.io/badge/Recharts-Visualization-8884D8?style=for-the-badge" />

</p>

---

# 🛰️ Project Overview

**SATGUARD AI** is an intelligent satellite health monitoring and anomaly detection platform designed to continuously monitor satellite telemetry, identify abnormal operating conditions, detect potential subsystem failures, and provide real-time alerts through an interactive monitoring dashboard.

Satellites continuously generate telemetry from multiple onboard subsystems. These telemetry parameters provide important information about the spacecraft's operational condition.

However, continuously monitoring and interpreting large volumes of telemetry data can be difficult for human operators.

SATGUARD AI addresses this challenge by providing an intelligent software platform that transforms raw telemetry into meaningful health information.

The system uses a **Virtual 6U CubeSat Digital Twin** to simulate satellite operations and generate telemetry in real time.

The platform monitors parameters such as:

- ☀️ Solar Power
- ⚡ Voltage
- 🌡️ Temperature
- 📡 Signal Strength
- 💻 CPU Usage
- 🔋 Power and subsystem health

The system can also deliberately introduce abnormal conditions through a **Failure Injection System**, allowing the complete anomaly detection and alert pipeline to be demonstrated in a controlled environment.

---

# 🎯 Problem Statement

Satellites operate in harsh and unpredictable environments.

They are exposed to:

- Extreme temperature variations
- Radiation
- Power fluctuations
- Communication interruptions
- Hardware degradation
- Computational limitations
- Environmental disturbances

At the same time, satellites continuously generate telemetry data from different subsystems.

A satellite operator may need to monitor hundreds or thousands of telemetry parameters over long periods.

Traditional monitoring approaches often depend heavily on predefined thresholds and manual observation.

This can create several challenges:

### 1. Large Volume of Telemetry

Satellites generate telemetry continuously, making manual monitoring difficult.

### 2. Delayed Failure Detection

A subsystem may gradually move away from its normal operating behaviour before reaching a critical threshold.

### 3. Multiple Subsystems

Power, thermal, communication, and computing systems can interact with each other.

### 4. Hidden Anomalies

Some failures may not immediately produce extreme values. Instead, they may appear as unusual patterns over time.

### 5. Need for Predictive Maintenance

Detecting a failure after it happens is not always sufficient.

A better system should identify warning patterns before the failure becomes critical.

---

# 💡 Our Solution

SATGUARD AI introduces an intelligent satellite monitoring architecture based on a **Virtual CubeSat Digital Twin**.

The system continuously generates satellite telemetry and processes it through an anomaly detection pipeline.

The overall workflow is:

```text
                  ┌─────────────────────┐
                  │ Virtual 6U CubeSat  │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Telemetry Generator │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Telemetry Processing│
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Anomaly Detection   │
                  └──────────┬──────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
             ┌─────────────┐   ┌─────────────┐
             │ Health       │   │ Alert       │
             │ Assessment   │   │ Generation  │
             └──────┬──────┘   └──────┬──────┘
                    │                 │
                    └────────┬────────┘
                             ▼
                  ┌─────────────────────┐
                  │ Monitoring Dashboard│
                  └─────────────────────┘
