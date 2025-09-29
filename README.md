# RAG ChatBot using Gemini
RAG ChatBot is a real-time AI chatbot using FastAPI, React/TypeScript, and Google Gemini LLM.
It answers user questions based on uploaded source using Retrieval-Augmented Generation (RAG).
Ideal for document Q&A, customer support, or knowledge retrieval applications.

#### Check the interface ####
https://rag-chat-bot-ebon.vercel.app/

## ⚙️ Technologies & Languages

**Back-End:**
- **Python**  
- **FastAPI** (API framework)  
- **Uvicorn** (ASGI server)  
- **LangChain** (Text splitting and processing)  
- **Google Gemini API** (Embeddings & AI responses)  
- **FAISS** (Vector store for similarity search)  

**Front-End:**
- **React**
-  **TypeScript**
-  **Tailwind CSS**

 **Components:**
    `ChatBox`, `ChatComponent`, `DarkModeButton`, `Input`, `Loading`, `Source`

**Supported File Format for RAG:**  
- PDF only

## 💡 How It Works
<img src="https://github.com/yazanhs1029/RAG_ChatBot/blob/main/RAG_Chatbot%20-%20Copy.png" width="700" height="400"/>

1. **File-based Q&A (RAG mode):**
   - The backend receives a PDF file through the `/upload` endpoint (FastAPI running on **port 8000**).
   - The PDF is read and split into smaller chunks using `RecursiveCharacterTextSplitter` from **LangChain**.
   - Each chunk is converted into embeddings using **Google Gemini API**.
   - The embeddings are stored in a **FAISS vector store** for fast similarity search.
   - When the user sends a question:
     - The question is encoded using Google Gemini embeddings.
     - The system searches the vector store for the most relevant chunks.
     - A prompt is generated including the user question and the retrieved context.
     - The prompt is sent to Google Gemini to generate a response.
   - The chatbot returns the response to the frontend (React + TypeScript running on **port 3000**), showing it in the chat interface in real-time.

2. **Direct Chat mode:**
   - Users can also send messages directly to the `/text` endpoint without uploading any file.
   - The message is processed and sent to Google Gemini for a general AI response.
   - The bot replies immediately, acting like a **normal chatbot**.
  
## 🚀 How to Run
### ✅ 1. Activate the Back-End Virtual Environment

Navigate to your project folder and activate the virtual environment:

```bash
myenv\Scripts\activate
```
### ✅ 2. Activate the server:
```bash
uvicorn index:app --reload
```

### ✅ 3.Activate the Front-End
Navigate to your Front-End folder and activate the virtual environment:
```bash
npm run dev
```

