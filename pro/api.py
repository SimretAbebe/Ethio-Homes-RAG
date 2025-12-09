# api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from main import get_properties

app = FastAPI(title="EthioHomes API")

# Allow frontend to connect (CORS settings)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (e.g., localhost:5173); update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
async def search(q: str = ""):
    if not q.strip():
        return {"response": "Please ask me something about properties in Addis Ababa or Bahir Dar!"}
    
    result = get_properties(q.strip())
    return {"response": result}

@app.get("/")
async def root():
    return {"message": "EthioHomes API is running! Try /search?q=your question"}

# Run with: uvicorn api:app --reload --port=8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)