export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: "Available" | "Sold";
  image?: string;
}

export interface SearchResponse {
  properties: Property[];
  recommendation: string;
}

export async function searchProperties(query: string): Promise<SearchResponse> {
  if (!query.trim()) {
    return { properties: [], recommendation: "" };
  }

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`
    );

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();
    const text = data.response || "";

    const properties: Property[] = [];
    const lines = text.split("\n");
    let current: Partial<Property> = {};

    for (const line of lines) {
      if (line.match(/Property #\d+/) || line.match(/^\d+\./)) {
        if (current.id) properties.push(current as Property);
        current = {
          id: "0",
          type: "House",
          location: "Addis Ababa",
          price: 0,
          bedrooms: 0,
          bathrooms: 0,
          status: "Sold",
        };

        const idMatch = line.match(/#(\d+)/);
        if (idMatch) current.id = idMatch[1]; 

        if (line.includes("house")) current.type = "House";
        if (line.includes("apartment")) current.type = "Apartment";
        if (line.includes("villa")) current.type = "Villa";
      }

      if (line.includes("ETB")) {
        const price = line.match(/([\d,]+) ?ETB/);
        if (price) current.price = parseInt(price[1].replace(/,/g, ""));
      }

      if (line.includes("bed")) {
        const beds = line.match(/(\d+) ?bed/);
        if (beds) current.bedrooms = parseInt(beds[1]);
      }

      if (line.includes("bath")) {
        const baths = line.match(/(\d+) ?bath/);
        if (baths) current.bathrooms = parseInt(baths[1]);
      }

      if (line.includes("Available")) current.status = "Available";
      if (line.includes("Addis")) current.location = "Addis Ababa";
      if (line.includes("Bahir Dar")) current.location = "Bahir Dar";

      if (line.includes("→") || line.includes("Highlight")) {
        current.title = line
          .replace(/→ ?/, "")
          .replace("Highlight:", "")
          .trim();
        current.description = current.title;
      }
    }
    if (current.id) properties.push(current as Property);

    const recommendation = text.includes("My top recommendation")
      ? text.split("My top recommendation:")[1].split("\n")[0]
      : "Check out these great options!";

    return {
      properties: properties.slice(0, 5),
      recommendation,
    };
  } catch (error) {
    console.error("Search failed:", error);
    return {
      properties: [],
      recommendation: "Backend is offline. Run: uvicorn api:app --reload",
    };
  }
}
