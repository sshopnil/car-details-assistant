import { NextRequest, NextResponse } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { AIMessage } from "@langchain/core/messages";
import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";
import { ChatGroq } from "@langchain/groq";

// Initialize memory
const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
});

// Initialize Hugging Face Inference
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

function createPrompt(cars, history, topic) {
  // Filter out null or empty cars metadata
  const validCars = cars.filter(car => car != null && car !== undefined);

  return `
    You are a knowledgeable car expert. Your job is to answer questions based solely on the following car information: 
    ${JSON.stringify(validCars)}. 

    Your answers must always be directly related to these cars only. If the user asks anything outside of car-related topics, 
    politely remind them that you only provide car details and request that they ask questions about cars specifically.

    If the user asks about a specific detail not available in the car information provided, respond by saying: 
    "Sorry, I don't have that specific data."

    Maintain the conversation history for context. \n${history}\n
    And response only the User Question: ${topic}

    Answer concisely (within 20-30 words). Stay on topic and do not provide information outside the given car information.
  `;
}

export async function POST(request) {
  const { text } = await request.json();

  // Add the user message to memory
  memory.chatHistory.addUserMessage({role: 'user', content: text});

  // Format the conversation history
  const formattedHistory = memory.chatHistory.messages
    .map(entry => `${entry.role}: ${entry.content}`)
    .join("\n");

  const queryEmbedding = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
  });

  // Initialize Pinecone and query it for relevant cars
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pinecone.Index("car2");

  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: 3, 
    includeMetadata: true,
  });

  // Get relevant cars from Pinecone query response
  const relevantCars = queryResponse.matches.map((match) => match.metadata);

  // Create the prompt for the Hugging Face model
  // const prompt = createPrompt(relevantCars, formattedHistory, text);

  // // Now, we'll call the Hugging Face model directly
  // const modelResponse = await hf.textGeneration({
  //   model: "mistralai/Mixtral-8x7B-Instruct-v0.1", 
  //   inputs: prompt,
  // });

  // // Add assistant's response to memory
  // const cleanedResponse = modelResponse.generated_text
  // .replace(prompt, "") // Remove the prompt from the response
  // .trim(); // Remove any leading/trailing whitespace
  // // Get only the most recent assistant message
  
  // memory.chatHistory.addAIChatMessage({role: 'bot', content: cleanedResponse});

  //   // console.log(memory.chatHistory);
  // // Return only the latest assistant message content
  // return NextResponse.json({ data: cleanedResponse, history: memory.chatHistory.messages });

  const model = new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0,
  });
  const prompt = ChatPromptTemplate.fromTemplate(
    "You are a knowledgeable car expert. Your job is to answer questions based solely on the following car information: {cars} Your answers must always be directly related to these cars only. If the user asks anything outside of car-related topics, politely remind them that you only provide car details and request that they ask questions about cars specifically. If the user asks about a specific detail not available in the car information provided, respond by saying: Sorry, I don't have that specific data. Maintain the conversation history for context.${history} And response only the User Question: {topic} Answer concisely (within 20-30 words). Stay on topic and do not provide information outside the given car information."
  );
  
  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  const res = await chain.invoke({cars: relevantCars,  history: formattedHistory, topic: text });
  
  memory.chatHistory.addAIChatMessage({role: 'bot', content: res});
  
  const latestAssistantMessage = memory.chatHistory.messages
    .filter(entry => entry instanceof AIMessage)  // Filters only AI messages
    .pop(); // Gets the most recent AI message
  // Return only the latest assistant message content
  return NextResponse.json({ data: latestAssistantMessage?.content, history: memory.chatHistory.messages });
}
