from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import os
import pandas as pd

# Load CSV
df = pd.read_csv("review.csv")

# Embedding model
embeddings = OllamaEmbeddings(model="mxbai-embed-large")

# DB location
db_location = "./chroma_real_estate_db"
add_documents = not os.path.exists(db_location)

# Build documents only once
if add_documents:
    documents = []
    ids = []

    for _, row in df.iterrows():
        content = f"""
        Title: {row.get('title', '')}
        Description: {row.get('description', '')}
        Location: {row['location']}
        Type: {row['type']}
        Price: {row['price']}
        Bedrooms: {row['bedrooms']}
        Bathrooms: {row['bathrooms']}
        Size: {row.get('size', '')} sq.m.
        Status: {row['status']}
        """.strip()

        doc = Document(
            page_content=content,
            metadata={
                "property_id": row["property_id"],
                "location": row["location"],
                "type": row["type"],
                "price": int(row["price"]) if pd.notna(row["price"]) else 0,
                "bedrooms": int(row["bedrooms"]) if pd.notna(row["bedrooms"]) else 0,
                "bathrooms": int(row["bathrooms"]) if pd.notna(row["bathrooms"]) else 0,
                "status": row["status"]
            },
            id=str(row["property_id"])
        )
        documents.append(doc)
        ids.append(str(row["property_id"]))

# Create vector store
vector_store = Chroma(
    collection_name="real_estate_properties",
    persist_directory=db_location,
    embedding_function=embeddings
)

# Add docs only first time
if add_documents:
    vector_store.add_documents(documents=documents, ids=ids)


retriever = vector_store.as_retriever(
    search_type="mmr",                   
    search_kwargs={
        "k": 3,                           
        "fetch_k": 20,                   
        "lambda_mult": 0.7                
    }
)