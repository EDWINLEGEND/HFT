# Demo Scenario: Chemical Processing Plant 🧪

**Objective**: Demonstrate CivicAssist's ability to handle **new regulations** dynamically.

We have added a new regulation: `Water Pollution Control Rules 2024` which mandates **Zero Liquid Discharge (ZLD)** for chemical industries. We will submit an application that violates this to see if the AI catches it.

---

## 📋 Pre-Demo Setup

### 1. Ingest the New Data
(Do this once before the demo starts)

Open a terminal and run:
```bash
# Ingest the new regulation file into ChromaDB
curl -X POST http://localhost:8000/api/v1/regulations/ingest
```

---

## 🎭 Demo Script

### Step 1: Applicant Mode

**Narrative**: "I am a chemical plant owner applying for a new permit. I plan to treat my water and discharge it into the river."

1. Go to **Applicant Mode**.
2. Fill in the form with this data (Copy & Paste):

| Field | Value | Notes |
|-------|-------|-------|
| **Industry Name** | `XYZ Chemical Solutions` | |
| **Square Feet** | `10000` | |
| **Water Source** | `Private Borewell` | |
| **Drainage System** | `Discharge to nearby river after treatment` | 🚩 **VIOLATION** |
| **Air Pollution** | `Scrubbers installed` | |
| **Waste Management** | `Hazardous waste to authorized recycler` | |
| **Nearby Homes** | `600 meters` | Buffer zone is ok (>500m) |
| **Water Level** | `45 feet` | |

3. Click **Run Pre-Submission Check**.

### Step 2: Observe Results

**Expected Outcome**:
- **Status**: `Non-Compliant` (Red)
- **Primary Issue**:
  - **Risk**: `High`
  - **Description**: "Discharge into river is prohibited. Zero Liquid Discharge (ZLD) system is mandatory for chemical industries."
  - **Citation**: `Water Pollution Control Rules 2024`

**Key Talking Point**:
> "Notice how the system cited the 'Water Pollution Control Rules 2024'. This regulation didn't exist in the system yesterday. We just added the file, and the AI automatically learned it."

### Step 3: Officer Mode (Optional)

1. Go to **Officer Mode**.
2. Select the `XYZ Chemical Solutions` application (if saved/mocked, otherwise skip).
3. Click to analyze and show the explainability panel citing the specific ZLD clause.

---

## 🔍 Why This Proves It's Real
- The "Textile" and "Steel" examples might look hardcoded.
- This "Chemical" example depends entirely on the file `water_pollution_control_rules_2024.txt` we just added.
- If the AI didn't read that file, it wouldn't know about "Zero Liquid Discharge".
