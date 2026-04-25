# Mitra - Empowering Survivors Through Tech, Law & Empathy

**Mitra** is a comprehensive, AI-driven sanctuary platform built specifically for women and domestic abuse survivors in India. It bridges the critical gap between **legal empowerment** and **mental health support**, uniting them into a single, cohesive, and highly secure ecosystem. 

At its core, the platform features **Mitra**, an empathetic AI companion that feels like chatting with a trusted friend. Yet beneath this approachable persona lies a deep, nuanced capability to provide verified legal guidance, detect behavioral anomalies, and seamlessly escalate cases to verified NGOs and therapists.

---

## 📊 The Crisis: Indian Market Context & The Need for Mitra

The intersection of domestic violence, legal intimidation, and mental health stigma in India creates a paralyzing environment for survivors. According to the National Family Health Survey (NFHS-5), nearly 30% of women in India have experienced domestic violence, yet fewer than 1% ever seek help from institutional authorities. 

Mitra addresses three critical barriers:

1. **The Legal Labyrinth**: The Indian legal system—including the Indian Penal Code (IPC), the newly introduced Bharatiya Nyaya Sanhita (BNS), and the Protection of Women from Domestic Violence Act (PWDVA), 2005—is highly complex. Legal documents are predominantly available in formal English and filled with intimidating jargon. Survivors often do not know their basic rights (e.g., the right to reside in a shared household, protection orders), let alone how to invoke them without risking immediate retaliation.
2. **Behavioral & Social Isolation**: Domestic abuse in India is often accompanied by severe social conditioning and forced isolation. Abusers systematically cut off the survivor's support networks. Survivors display specific behavioral anomalies—such as withdrawal, sudden changes in daily restoration habits, or linguistic markers of severe distress—that go unnoticed by traditional systems until it is too late.
3. **The "Help" Stigma**: Seeking formal therapy or walking into a police station brings immense societal stigma. Survivors need a discreet, culturally sensitive first point of contact that understands Hindi, Hinglish, and regional nuances without judgment or immediate pressure to file a police report.

**Mitra** dismantles these barriers by bringing the lawyer, the therapist, and the support group directly to the survivor's smartphone in their native language, functioning entirely at their pace.

---

## 🔬 Research & Market Analysis

The architecture of Mitra is heavily informed by primary research and behavioral psychology concerning domestic violence survivors in the Indian subcontinent:

* **The "Justice Drop-off" Phenomenon**: Research indicates that out of the 1% of women who do approach institutional authorities, nearly 60% drop their cases within the first 6 months. Our analysis revealed this is primarily due to legal intimidation, lack of psychological support, and retaliatory threats. **Insight**: Legal aid *must* be inextricably linked with mental health support to reduce case abandonment.
* **Linguistic Disenfranchisement**: Over 70% of Indian legal documentation and police First Information Reports (FIRs) are drafted in formal English or highly complex administrative Hindi/regional languages. **Insight**: An AI companion must process vernacular "Hinglish" and regional speech natively, translating a survivor's casual, emotional speech directly into formal legal categorizations (like IPC 498A or PWDVA).
* **The "Window of Willingness"**: Psychological research on the "Cycle of Abuse" shows that survivors have very narrow temporal windows where they feel empowered or safe enough to seek help. If the initial point of contact is slow, bureaucratic, or judgmental, the window closes. **Insight**: An instant, non-judgmental, 24/7 AI first-responder drastically increases the likelihood of a survivor initiating the reporting process and escaping the cycle.

---

## 🚀 Key Innovations & Core Features

### 1. Mitra: The AI Companion & Legal Guide
To the survivor, Mitra acts as a normal, comforting chat companion—an "older sister" (Didi) figure. It validates her feelings, listens without judgment, and provides psychological first aid. However, this conversational interface is actually a powerful triage engine that gently introduces actionable legal and psychological steps without overwhelming the user.

### 2. Deep RAG Implementation for Indian Law
General LLMs often hallucinate legal advice, which is extremely dangerous in domestic abuse scenarios. Mitra utilizes a robust **Retrieval-Augmented Generation (RAG)** pipeline specifically indexed on Indian Law.
* **Granular AI Analysis**: For each and every right mentioned by the user (e.g., "he took my salary," "he threatened my parents"), the RAG system performs real-time analysis.
* **Verified Database Mapping**: It cross-references the user's narrative against verified databases containing IPC Sections (e.g., 498A for cruelty), BNS replacements, and PWDVA provisions (e.g., economic abuse, verbal/emotional abuse).
* **Simplified Delivery**: It translates this complex legal mapping into simple, actionable steps delivered in Hindi, Hinglish, or English.

### 3. Behavioral Anomaly Detection & NLP Sentiment Tracking
Mitra doesn't just wait for the user to explicitly ask for an NGO; it actively monitors for risk vectors. 
* **Continuous Sentiment Analysis**: By analyzing the textual and tonal sentiment in the chat and tracking patterns in the "Daily Restoration" mood check-ins, the system detects behavioral anomalies.
* **Risk Factor Identification**: It looks for markers of severe depressive spikes, learned helplessness, prolonged isolation, or potential self-harm.
* **Proactive Intervention**: If a high-risk anomaly is detected, the platform gently shifts its dialogue to prompt professional help or triggers an automated escalation protocol, offering the `SHOW_HELP_BUTTON` to connect immediately with vetted NGOs.

### 4. Anonymous Peer Support (Chautara Courtyard)
Isolation is the abuser's greatest weapon. The **Chautara Courtyard** is a highly secure, moderated sanctuary space where survivors can read about others' experiences and share their own stories entirely anonymously. This shared empathy breaks the cycle of isolation and fosters communal healing.

### 5. Seamless NGO & Case Tracking Pipeline
When a survivor is ready, she can seamlessly transition from anonymous chatting to opening a formal case. 
* **NGO Dashboard**: Verified organizations receive these cases on a secure, dedicated dashboard. Coordinators can assign specialized legal or psychological units to specific cases.
* **Transparent Case Tracker**: The survivor tracks her case securely on her end. She sees exact progress states (e.g., "Received", "Triaging", "Active Support") and receives automated, encouraging support messages tailored to her specific situation.

---

## 🛠️ System Architecture & Tech Stack

Mitra is built as a highly responsive, full-stack web application designed for absolute privacy, speed, and linguistic inclusivity.

**Frontend Layer:**
* **Framework**: React.js powered by Vite for lightning-fast module replacement.
* **Language**: TypeScript for end-to-end type safety.
* **Styling & UI**: Tailwind CSS coupled with Framer Motion to create a calming, fluid, and non-triggering user interface.
* **Components**: shadcn/ui for accessible, robust interface elements.

**Backend & Data Layer:**
* **Framework**: FastAPI (Python) for high-performance, asynchronous API endpoints.
* **Database**: SQLite (`chautara_sanctuary.db`, `sahara_users.db`) for lightweight, secure, and isolated relational data storage.

**AI & Machine Learning Pipeline:**
* **Groq API**: Utilized for ultra-low latency LLM inference. This powers the conversational RAG pipeline and behavioral anomaly detection, ensuring responses feel instantaneous and natural.
* **Sarvam AI**: Integrated for native, highly accurate Hindi and Nepali Speech-to-Text (STT) dictation. This ensures that users who are illiterate, visually impaired, or simply typing-averse can speak their truth naturally.
* **Vector Database / RAG**: Specialized document loaders and vector embeddings designed for the semantic search and retrieval of specific Indian legal rights and mental health protocols.

---

## 🔄 The Survivor's Journey: End-to-End Flow

1. **Discreet Entry & Daily Check-in**: The survivor enters the platform (anonymously or via a secure registered account) and completes a quick, non-intrusive Daily Restoration check-in to log her emotional state.
2. **Conversational Triage**: She enters the chat with **Mitra**. She might use the voice feature to say in Hindi, *"Mere pati ne mujhe ghar se nikal diya aur paise bhi le liye."* (My husband threw me out of the house and took my money).
3. **AI Analysis & RAG Retrieval**: The system detects the language (Hinglish/Hindi) and uses RAG to pull specific legal rights regarding *economic abuse* and the *right to reside in a shared household* under the Domestic Violence Act. Mitra responds empathetically, validating her distress while explaining these rights simply.
4. **Behavioral Anomaly Detection**: Over multiple sessions, if the system detects escalating risk in her words or a downward trend in her check-in patterns, it identifies a behavioral anomaly and prompts immediate professional intervention.
5. **Escalation**: She decides she is ready and clicks to connect with an NGO. A secure, anonymized incident report is generated.
6. **NGO Action**: An NGO coordinator logs into their dashboard, views the categorized case, assigns a legal counselor and a therapist, and updates the case status to "Active Support".
7. **Resolution & Healing**: The survivor tracks her case securely via the UI while continuing to draw strength from the Chautara peer community and Mitra's daily check-ins.

---

## 🔒 Security & Privacy Promise

Given the extremely sensitive nature of domestic abuse, **Mitra** is built with a privacy-first architecture:
* No chat logs are utilized for model training.
* Anonymous reporting is a first-class citizen; users do not need to provide personally identifiable information (PII) to access core legal and emotional support.
* Quick-exit mechanisms and discreet UI design ensure the app can be used safely even in monitored households.

---

## 💻 Setup Instructions (Local Development)

### Prerequisites
* Node.js (v18+)
* Python (3.9+)
* API Keys: Groq API, Sarvam AI API (optional, for Speech-to-Text).

### 1. Backend Setup

1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Create and activate a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   Create a `.env` file in the `Backend` folder and add your specific API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   SARVAM_API_KEY=your_sarvam_api_key_here
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   *(The backend API documentation will be accessible at `http://localhost:8000/docs`)*

### 2. Frontend Setup

1. Open a new terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `Frontend` folder and map the necessary endpoints:
   ```env
   VITE_BACKEND_URL=http://localhost:8000/api
   VITE_API_BASE_URL=http://localhost:8000
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open the provided localhost URL (typically `http://localhost:8082` or `http://localhost:5173`) in your web browser.

---
**Mitra:** Because no woman should have to choose between fighting for her rights and protecting her peace of mind.
