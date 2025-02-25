# Car Assistant Chatbot

## Overview
The Car Assistant Chatbot is an AI-powered system designed to provide users with detailed information about cars. It leverages Pinecone for vector search, Hugging Face for natural language processing, and LangChain for conversational memory and response generation.

## Features
- **User Authentication**: Secure interaction via API endpoints.
- **Conversational Memory**: Maintains chat history for context-aware responses.
- **AI-Powered Responses**: Uses LangChain's ChatGroq model for generating answers.
- **Vector Search**: Queries a Pinecone index for relevant car data.
- **Natural Language Processing**: Uses Hugging Face embeddings for query understanding.
- **Strict Topic Adherence**: Responds only with available car-related information.

## Technology Stack
- **Next.js** - API route handling
- **LangChain** - Conversational memory and AI responses
- **Pinecone** - Vector database for storing and querying car data
- **Hugging Face** - NLP embeddings for query understanding
- **ChatGroq** - AI-powered response generation
- **BufferMemory** - Chat history management

## Installation
### Prerequisites
- Node.js (latest stable version)
- A Pinecone account & API key
- A Hugging Face API key

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/car-assistant-chatbot.git
   ```
2. Navigate to the project directory:
   ```sh
   cd car-assistant-chatbot
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file and add the following environment variables:
   ```env
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## API Endpoints
### POST `/api/chat`
Handles user queries and provides AI-generated responses.
#### Request Body:
```json
{
  "text": "Tell me about the latest Tesla models."
}
```
#### Response:
```json
{
  "data": "Tesla Model 3 is an electric sedan with advanced autopilot features.",
  "history": [...]
}
```

## Project Structure
```
src/
├── api/
│   └── route.js       # Main API handler
├── utils/
│   ├── memory.js      # Chat memory management
│   ├── embeddings.js  # Hugging Face embeddings handler
│   └── pinecone.js    # Pinecone vector database integration
└── app.js             # Main application logic
```

## Future Enhancements
- Expand database with more car details
- Improve chatbot accuracy with fine-tuned models
- Add voice-based queries

## Acknowledgements
- **Pinecone** for efficient vector search
- **Hugging Face** for NLP embeddings
- **LangChain** for conversational AI capabilities

