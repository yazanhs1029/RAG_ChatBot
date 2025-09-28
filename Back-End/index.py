import uvicorn
from fastapi import FastAPI, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import tempfile
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain.embeddings.base import Embeddings
from dotenv import load_dotenv
from google import genai

# --- إعداد FastAPI ---
app = FastAPI()
load_dotenv()
api_key = os.getenv("API_KEY")
client = genai.Client(api_key=api_key)

# --- إعداد CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- متغيرات عالمية ---
VectorStore = None

# --- دالة التحدث مع Gemini ---
def AskGemini(prompt):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return response.text

# --- Class لتوافق FAISS مع embeddings الجاهزة ---
class MyEmbeddings(Embeddings):
    def __init__(self, embedded_chunks=None):
        self.embedded_chunks = embedded_chunks

    def embed_documents(self, texts):
        if self.embedded_chunks is None:
            raise ValueError("embedded_chunks is None!")
        return [item.values for item in self.embedded_chunks.embeddings]

    def embed_query(self, text):
        return client.models.embed_content(
            model="models/embedding-001",
            contents=[text]
        ).embeddings[0].values

# --- Endpoint استقبال النصوص ---
@app.post("/text")
async def receive_text(request: Request):
    global VectorStore
    data = await request.json()
    user_text = data.get("TextContent", "")

    if not user_text:
        return JSONResponse(content={"reply": "No text provided."})

    # إعداد سياق البحث
    if VectorStore is None:
        related_context_content = ""
    else:
        Embedded_user_question = client.models.embed_content(
            model="models/embedding-001",
            contents=user_text
        ).embeddings[0].values
        related_context = VectorStore.similarity_search_by_vector(
            embedding=Embedded_user_question, k=1
        )
        related_context_content = related_context[0].page_content

    # إعداد الـ prompt
    prompt = f"""
You are an AI assistant. Answer the user's question clearly, formally, and in a well-structured way.

STYLE / FORMATTING REQUIREMENTS:
1.  Do NOT use Markdown (#, *, **).



USER QUESTION:
\"\"\"{user_text}\"\"\"

CONTEXT:
\"\"\"{related_context_content}\"\"\"
"""








    response = AskGemini(prompt)
    return JSONResponse({"reply": response})

# --- Endpoint رفع ملفات PDF ---
@app.post("/upload")
async def receive_file(file: UploadFile = File(...)):
    global VectorStore
    VectorStore = None

    # قراءة الملف
    User_file = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(User_file)
        temp_file_path = temp_file.name

    # تحميل محتوى PDF
    loader = PyPDFLoader(temp_file_path)
    user_file_content = loader.load()

    # تقسيم النصوص إلى chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=250,
        chunk_overlap=75
    )
    File_chunks = splitter.split_documents(user_file_content)
    File_list_chunks = [chunk.page_content for chunk in File_chunks]

    # عمل embeddings لكل chunk
    Embedded_chunks = client.models.embed_content(
        model="models/embedding-001",
        contents=File_list_chunks
    )

    # إنشاء vectorstore باستخدام النصوص والـ embeddings
    VectorStore = FAISS.from_texts(File_list_chunks, MyEmbeddings(Embedded_chunks))

    return JSONResponse(content={"status": "File processed and embeddings stored successfully."})

# --- رسالة عند تشغيل السيرفر ---
@app.on_event("startup")
async def startup_event():
    print("Server is listening on port 8000")

# --- تشغيل السيرفر ---
if __name__ == "__main__":
    uvicorn.run("index:app", host="127.0.0.1", port=8000, reload=True)
