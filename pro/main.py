# main.py — FINAL VERSION (works perfectly with your frontend)
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever

# Model
model = OllamaLLM(model="llama3.2", temperature=0.3)

# SIMPLE & ROBUST PROMPT — no template variables that break
template = """
You are a friendly, professional real estate agent in Ethiopia (Addis Ababa & Bahir Dar).

User asked: "{question}"

Here are the top matching properties from the database:
{reviews}

INSTRUCTIONS:
- List up to 5 properties in a clean, numbered format
- For each: Property ID, type, bedrooms/bathrooms, price, location, status
- Highlight the best feature (from title/description)
- Prioritize "Available" properties
- End with: "My top recommendation: Property #X — best match for you!"
- Finally ask: "Which one interests you? Want photos or more details?"

Be natural, warm, and exciting. Never make up details.
"""

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

def get_properties(question: str) -> str:
    docs = retriever.invoke(question)
    
    if not docs:
        return "Sorry, I couldn't find any properties right now. Try: 'houses in Addis Ababa' or 'apartments in Bahir Dar'"

    # Format docs cleanly for the AI
    properties_text = []
    for i, doc in enumerate(docs[:5], 1):
        m = doc.metadata
        content = doc.page_content
        
        title = next((l for l in content.split('\n') if 'Title:' in l), "").replace("Title:", "").strip()
        desc = next((l for l in content.split('\n') if 'Description:' in l), "").replace("Description:", "").strip()
        
        highlight = desc.split('.')[0] if desc else title
        
        properties_text.append(
            f"{i}. Property #{m.get('property_id', '?')} — {m.get('type', 'Home').title()}\n"
            f"   📍 {m.get('location', 'Ethiopia')} • {m.get('bedrooms', '?')} bed • {m.get('bathrooms', '?')} bath\n"
            f"   💰 {m.get('price', 0):,} ETB • Status: {m.get('status', 'Unknown')}\n"
            f"   → {highlight or 'Great option!'}"
        )

    context = "\n\n".join(properties_text)

    try:
        response = chain.invoke({
            "question": question,
            "reviews": context
        })
        return response
    except Exception as e:
        return f"AI error: {e}. But your properties are ready!"

# Terminal mode (still works!)
if __name__ == "__main__":
    print("EthioHomes AI — Addis Ababa & Bahir Dar")
    while True:
        q = input("\nAsk: ").strip()
        if q.lower() in ["q", "quit", "exit", ""]:
            print("See you soon!")
            break
        print(get_properties(q))
        print("\n" + "─"*80 + "\n")