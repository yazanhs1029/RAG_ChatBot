# RAG ChatBot using Gemini
RAG ChatBot is a real-time AI chatbot using FastAPI, React/TypeScript, and Google Gemini LLM.
It answers user questions based on uploaded source using Retrieval-Augmented Generation (RAG).
Ideal for document Q&A, customer support, or knowledge retrieval applications.

## 💡 How It Works
 
1. **File-based Q&A (RAG mode):**
   - The backend receives a PDF file through the `/upload` endpoint.
   - The PDF is read and split into smaller chunks using `RecursiveCharacterTextSplitter` from **LangChain**.
   - Each chunk is converted into embeddings using **Google Gemini API**.
   - The embeddings are stored in a **FAISS vector store** for fast similarity search.
   - When the user sends a question:
     - The question is encoded using Google Gemini embeddings.
     - The system searches the vector store for the most relevant chunks.
     - A prompt is generated including the user question and the retrieved context.
     - The prompt is sent to Google Gemini to generate a response.
   - The chatbot returns the response to the frontend, showing it in the chat interface in real-time.

2. **Direct Chat mode:**
   - Users can also send messages directly to the `/text` endpoint without uploading any file.
   - The message is processed and sent to Google Gemini for a general AI response.
   - The bot replies immediately, acting like a **normal chatbot**.

