import { Pinecone } from "@pinecone-database/pinecone";

export async function POST(request) {
  const { id, embeddings } = await request.json();

  try {
    // Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Connect to the index
    const index = pinecone.Index("cars");

    // Upsert embeddings into Pinecone
    await index.upsert([
      {
        id: id.toString(),
        values: embeddings,
      },
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error storing embeddings in Pinecone:", error);
    return Response.json(
      { error: "Failed to store embeddings" },
      { status: 500 }
    );
  }
}
