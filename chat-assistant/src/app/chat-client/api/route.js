import { NextRequest, NextResponse } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { BufferMemory } from "langchain/memory";
import { AIMessage } from "@langchain/core/messages";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

function createPrompt(cars, history, topic) {
  // Filter out null or empty cars metadata
  const validCars = cars.filter(car => car != null && car !== undefined);

  return `You are a car expert, Answer the user's question based on the following car information: 
  ${JSON.stringify(validCars)}; 
  if anything else tell the user that you only provide car details.
  Maintain a conversation history. \n${history}\nUser Question: ${topic}`;
}

export async function POST(request) {
  const { text } = await request.json();

  // Add the user message to memory
  memory.chatHistory.addUserMessage(text);

  // Format the conversation history
  const formattedHistory = memory.chatHistory.messages
    .map(entry => `${entry.role}: ${entry.content}`)
    .join("\n");

  // Get query embedding using Hugging Face's feature extraction
  const queryEmbedding = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
  });

  // Initialize Pinecone and query it for relevant cars
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pinecone.Index("cars");

  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: 3, // Retrieve top 3 relevant cars
    includeMetadata: true,
  });

  // Get relevant cars from Pinecone query response
  const relevantCars = queryResponse.matches.map((match) => match.metadata);

  // Create the prompt for the Hugging Face model
  const prompt = createPrompt(relevantCars, formattedHistory, text);

  // Call Hugging Face's text generation model
  const res = await hf.textGeneration({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Use Mixtral model
    inputs: prompt,  // Make sure 'inputs' is a string containing the prompt
  });

  // Add assistant's response to memory
  memory.chatHistory.addAIChatMessage(res.generated_text);

  // Get only the most recent assistant message
  const latestAssistantMessage = memory.chatHistory.messages
    .filter(entry => entry instanceof AIMessage)  // Filters only AI messages
    .pop(); // Gets the most recent AI message

    console.log(queryResponse.matches);
  // Return only the latest assistant message content
  return NextResponse.json({ data: latestAssistantMessage?.content, history: memory.chatHistory.messages });
}
