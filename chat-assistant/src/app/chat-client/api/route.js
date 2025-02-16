import { NextRequest, NextResponse } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { BufferMemory } from "langchain/memory";
import { AIMessage } from "@langchain/core/messages";

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
});

export async function POST(request) {
  const { text } = await request.json();

  const model = new ChatGroq({
    model: "mixtral-8x7b-32768",
    temperature: 0,
  });

  
  memory.chatHistory.addUserMessage(text);

  
  const formattedHistory = memory.chatHistory.messages
    .map(entry => `${entry.role}: ${entry.content}`)
    .join("\n");

  
  const prompt = ChatPromptTemplate.fromTemplate(
    "You are a helpful car assistant, who provides only cars info; if anything else tell the user that you only provide car details. Maintain a conversation history. \n{history}\nUser: {topic}"
  );

  
  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  const res = await chain.invoke({ history: formattedHistory, topic: text });

  
  memory.chatHistory.addAIChatMessage(res);

  
  const latestAssistantMessage = memory.chatHistory.messages
    .filter(entry => entry instanceof AIMessage)  // Filters only AI messages
    .pop(); // Gets the most recent AI message

  // Return only the latest assistant message content
  return NextResponse.json({ data: latestAssistantMessage?.content, history: memory.chatHistory.messages });
}
