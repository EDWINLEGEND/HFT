# Regulations Directory

This directory is intended for storing government regulation documents that will be ingested into the vector database.

## Supported Formats
- PDF (.pdf)
- DOCX (.docx)
- TXT (.txt)

## Usage

In Phase 2, you can place regulation documents here and run the ingestion script to populate the ChromaDB vector store.

Example regulations to add:
- Kerala Industrial Policy documents
- Environmental regulations
- Fire safety codes
- Building codes
- Waste management rules

## Structure

Organize documents by department or category for easier management:

```
regulations/
├── environment/
│   ├── environmental_clearance_guidelines.pdf
│   └── pollution_control_norms.pdf
├── fire_safety/
│   └── fire_safety_requirements.pdf
├── local_body/
│   └── kerala_industrial_policy_2023.pdf
└── waste_management/
    └── hazardous_waste_rules_2016.pdf
```

This structure is optional but recommended for maintainability.
