"""
Seed Data Generator for Officer Dashboard Demo
Creates diverse applications to showcase all Phase 1 features
"""

import json
import os
from datetime import datetime, timedelta
import uuid

# Ensure data directory exists
os.makedirs('data', exist_ok=True)

# Sample applications with varying compliance states
seed_applications = [
    {
        "id": str(uuid.uuid4()),
        "submitted_at": (datetime.utcnow() - timedelta(days=2)).isoformat(),
        "status": "submitted",
        "time_saved_seconds": 1200.0,  # 20 mins
        "officer_action": None,
        "officer_notes": None,
        "rejection_reason": None,
        "application_data": {
            "industry_name": "GreenTech Manufacturing Ltd.",
            "square_feet": "50000",
            "water_source": "Municipal supply + Borewell",
            "drainage": "Connected to city sewage system",
            "air_pollution": "Electrostatic precipitators installed, emissions within limits",
            "waste_management": "Segregated waste disposal, hazardous waste to authorized vendor",
            "nearby_homes": "500 meters",
            "water_level_depth": "150 feet",
            "document_url": "/uploads/sample_greentech.pdf"
        },
        "compliance_report": {
            "status": "compliant",
            "confidence_score": 0.92,
            "issues": [
                {
                    "issue_type": "recommendation",
                    "severity": "low",
                    "description": "Consider installing rainwater harvesting system for sustainability",
                    "regulation_reference": "Environmental Guidelines 2024, Section 12.3",
                    "department": "environmental"
                }
            ],
            "missing_documents": [],
            "recommendations": [
                "Maintain emission monitoring records",
                "Submit quarterly compliance reports"
            ],
            "regulation_coverage": 0.95,
            "generated_at": datetime.utcnow().isoformat()
        }
    },
    {
        "id": str(uuid.uuid4()),
        "submitted_at": (datetime.utcnow() - timedelta(days=1)).isoformat(),
        "status": "submitted",
        "time_saved_seconds": 1150.0,
        "officer_action": None,
        "officer_notes": None,
        "rejection_reason": None,
        "application_data": {
            "industry_name": "Apex Chemical Industries",
            "square_feet": "75000",
            "water_source": "River water with treatment plant",
            "drainage": "Effluent treatment plant (ETP) installed",
            "air_pollution": "Scrubbers and filters, monitoring pending",
            "waste_management": "Chemical waste storage on-site, disposal plan unclear",
            "nearby_homes": "200 meters",
            "water_level_depth": "120 feet",
            "document_url": "/uploads/sample_apex.pdf"
        },
        "compliance_report": {
            "status": "non_compliant",
            "confidence_score": 0.45,
            "issues": [
                {
                    "issue_type": "violation",
                    "severity": "high",
                    "description": "Residential area within 500m buffer zone for chemical industries. Violates zoning regulations.",
                    "regulation_reference": "Industrial Zoning Act 2023, Section 4.2",
                    "department": "local_body"
                },
                {
                    "issue_type": "missing_document",
                    "severity": "high",
                    "description": "Fire safety certificate not submitted. Mandatory for chemical industries.",
                    "regulation_reference": "Fire Safety Rules 2024, Clause 8.1",
                    "department": "fire_safety"
                },
                {
                    "issue_type": "violation",
                    "severity": "medium",
                    "description": "Hazardous waste disposal plan incomplete. Must specify authorized vendor details.",
                    "regulation_reference": "Hazardous Waste Management Rules 2024, Section 6",
                    "department": "environmental"
                }
            ],
            "missing_documents": [
                "Fire Safety Certificate",
                "Hazardous Waste Disposal Agreement"
            ],
            "recommendations": [
                "Relocate facility or obtain special exemption",
                "Submit fire safety audit report",
                "Provide authorized vendor contract"
            ],
            "regulation_coverage": 0.78,
            "generated_at": datetime.utcnow().isoformat()
        }
    },
    {
        "id": str(uuid.uuid4()),
        "submitted_at": (datetime.utcnow() - timedelta(hours=12)).isoformat(),
        "status": "submitted",
        "time_saved_seconds": 1180.0,
        "officer_action": None,
        "officer_notes": None,
        "rejection_reason": None,
        "application_data": {
            "industry_name": "Sunrise Textiles Pvt Ltd",
            "square_feet": "35000",
            "water_source": "Borewell",
            "drainage": "Septic tank system",
            "air_pollution": "Minimal emissions, natural ventilation",
            "waste_management": "Fabric waste recycled, dye waste to treatment facility",
            "nearby_homes": "800 meters",
            "water_level_depth": "180 feet",
            "document_url": "/uploads/sample_sunrise.pdf"
        },
        "compliance_report": {
            "status": "partial",
            "confidence_score": 0.68,
            "issues": [
                {
                    "issue_type": "ambiguity",
                    "severity": "medium",
                    "description": "Dye waste treatment facility details unclear. Requires verification of authorization.",
                    "regulation_reference": "Water Pollution Control Rules 2024, Section 9.4",
                    "department": "environmental"
                },
                {
                    "issue_type": "missing_document",
                    "severity": "medium",
                    "description": "Building plan approval not attached. Required for structures >30,000 sq ft.",
                    "regulation_reference": "Building Code 2023, Article 15",
                    "department": "local_body"
                }
            ],
            "missing_documents": [
                "Building Plan Approval"
            ],
            "recommendations": [
                "Submit waste treatment facility authorization",
                "Provide building plan sanction letter",
                "Clarify water consumption estimates"
            ],
            "regulation_coverage": 0.82,
            "generated_at": datetime.utcnow().isoformat()
        }
    },
    {
        "id": str(uuid.uuid4()),
        "submitted_at": (datetime.utcnow() - timedelta(hours=6)).isoformat(),
        "status": "submitted",
        "time_saved_seconds": 1220.0,
        "officer_action": None,
        "officer_notes": None,
        "rejection_reason": None,
        "application_data": {
            "industry_name": "Metro Food Processing Unit",
            "square_feet": "25000",
            "water_source": "Municipal supply",
            "drainage": "Grease trap + city sewage",
            "air_pollution": "Kitchen exhaust with filters",
            "waste_management": "Organic waste to composting, packaging waste recycled",
            "nearby_homes": "1200 meters",
            "water_level_depth": "N/A - No borewell",
            "document_url": "/uploads/sample_metro.pdf"
        },
        "compliance_report": {
            "status": "compliant",
            "confidence_score": 0.88,
            "issues": [
                {
                    "issue_type": "recommendation",
                    "severity": "low",
                    "description": "Install water meter for consumption monitoring as per best practices",
                    "regulation_reference": "Water Conservation Guidelines 2024",
                    "department": "environmental"
                }
            ],
            "missing_documents": [],
            "recommendations": [
                "Maintain food safety certifications",
                "Regular grease trap cleaning records"
            ],
            "regulation_coverage": 0.91,
            "generated_at": datetime.utcnow().isoformat()
        }
    },
    {
        "id": str(uuid.uuid4()),
        "submitted_at": (datetime.utcnow() - timedelta(hours=3)).isoformat(),
        "status": "submitted",
        "time_saved_seconds": 1100.0,
        "officer_action": None,
        "officer_notes": None,
        "rejection_reason": None,
        "application_data": {
            "industry_name": "TechPark Data Center",
            "square_feet": "40000",
            "water_source": "Municipal supply",
            "drainage": "Cooling water recycling system",
            "air_pollution": "HVAC with air quality monitoring",
            "waste_management": "E-waste to certified recycler, minimal other waste",
            "nearby_homes": "600 meters",
            "water_level_depth": "N/A",
            "document_url": "/uploads/sample_techpark.pdf"
        },
        "compliance_report": {
            "status": "partial",
            "confidence_score": 0.55,
            "issues": [
                {
                    "issue_type": "violation",
                    "severity": "high",
                    "description": "Fire suppression system specifications unclear. Data centers require FM-200 or equivalent.",
                    "regulation_reference": "Fire Safety Code for IT Infrastructure 2024, Section 11",
                    "department": "fire_safety"
                },
                {
                    "issue_type": "ambiguity",
                    "severity": "medium",
                    "description": "Diesel generator emissions data not provided. Required for backup power >500 KVA.",
                    "regulation_reference": "Air Quality Standards 2024, Clause 7.3",
                    "department": "environmental"
                },
                {
                    "issue_type": "missing_document",
                    "severity": "low",
                    "description": "E-waste recycler authorization certificate not attached",
                    "regulation_reference": "E-Waste Management Rules 2024",
                    "department": "environmental"
                }
            ],
            "missing_documents": [
                "Fire Suppression System Design",
                "E-Waste Recycler Certificate"
            ],
            "recommendations": [
                "Submit detailed fire safety plan",
                "Provide generator emission test reports",
                "Attach recycler authorization"
            ],
            "regulation_coverage": 0.74,
            "generated_at": datetime.utcnow().isoformat()
        }
    }
]

# Write to applications.json
output_file = 'data/applications.json'
with open(output_file, 'w') as f:
    json.dump(seed_applications, f, indent=2)

print(f"✅ Seed data created successfully!")
print(f"📁 File: {output_file}")
print(f"📊 Applications created: {len(seed_applications)}")
print("\nApplication Summary:")
for app in seed_applications:
    status = app['compliance_report']['status']
    confidence = app['compliance_report']['confidence_score']
    high_risk = len([i for i in app['compliance_report']['issues'] if i['severity'] == 'high'])
    print(f"  • {app['application_data']['industry_name']}")
    print(f"    Status: {status.upper()} | Confidence: {confidence*100:.0f}% | High-Risk: {high_risk}")
