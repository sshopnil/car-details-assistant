import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";

export const config = {
  api: {
    bodyParser: true, // Allow body parsing for raw JSON
  },
};

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req) {
  try {
    // Parse the raw JSON body
    const jsonData = await req.json();

    if (!jsonData || !jsonData.cars || !Array.isArray(jsonData.cars)) {
      return Response.json({ error: "Invalid or missing 'cars' data" }, { status: 400 });
    }

    
    const sanitizeMetadata = (metadata) => {
      return Object.fromEntries(
        Object.entries(metadata).map(([key, value]) => {
          if (value === null) {
            
            if (key.includes('priceRange') || key.includes('mileage') || key.includes('maintenanceCost') || key.includes('horsepowerAndTorque') || key.includes('acceleration') || key.includes('topSpeed') || key.includes('cargoSpace') || key.includes('towingCapacity') || key.includes('batteryRange') || key.includes('insuranceCostEstimate') || key.includes('annualMaintenanceCostEstimate') || key.includes('parkingSensorsCamera')) {
              return [key, 0]; // Replace null with 0 for numeric fields
            } else if (key.includes('ColorOptions') || key.includes('features') || key.includes('systems') || key.includes('assist') || key.includes('systems')) {
              return [key, []];
            } else {
              return [key, ""]; 
            }
          }
          return [key, value];
        })
      );
    };

    // Generate embeddings and upsert into Pinecone
    const vectors = await Promise.all(
      jsonData.cars.map(async (car) => {
        const carText = JSON.stringify(car);
        const embedding = await hf.featureExtraction({
          model: "sentence-transformers/all-MiniLM-L6-v2",
          inputs: carText,
        });

        // Sanitize the metadata
        const sanitizedMetadata = sanitizeMetadata(car);

        return { id: car.id.toString(), values: embedding, metadata: sanitizedMetadata };
      })
    );

    await index.upsert(vectors);

    return Response.json({ message: "Data uploaded successfully to Pinecone" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
