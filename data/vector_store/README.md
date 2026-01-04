# Vector Store Directory

This directory will contain the ChromaDB persistent storage.

## What is ChromaDB?

ChromaDB is an open-source vector database optimized for storing and retrieving embeddings. In CivicAssist, it stores regulation documents as semantic vectors for fast similarity search.

## Usage

This directory will be automatically populated when:
1. The backend initializes the ChromaDB client (Phase 2)
2. Regulation documents are ingested from the `regulations/` directory
3. Embeddings are generated and stored

## Contents (After Phase 2)

```
vector_store/
├── chroma.sqlite3           # ChromaDB metadata database
└── [collection_uuid]/       # Collection-specific data
    ├── data_level0.bin
    ├── header.bin
    └── ...
```

## Notes

- **Do not manually edit** files in this directory
- The entire directory can be deleted to reset the vector store (will require re-ingestion)
- Backup this directory if you want to preserve your indexed regulations
- Size will grow based on the number of documents ingested

## Configuration

The collection name and path can be configured in `backend/app/core/config.py`:
- `vector_store_path`: Path to this directory
- `collection_name`: Name of the ChromaDB collection (default: "regulations")
