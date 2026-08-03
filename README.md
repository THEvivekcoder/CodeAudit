# CodeScope AI

CodeScope AI is an AI-powered code review application that analyzes source code and provides structured feedback on bugs, security issues, performance, readability, and code quality.

The application uses **React** for the frontend, **Node.js and Express.js** for the backend, and the **Google Gemini API** for AI-powered code analysis.

---

## Features

- AI-powered code review
- Detects potential bugs and logical issues
- Identifies security concerns
- Suggests performance improvements
- Provides code quality and best-practice recommendations
- Syntax-highlighted code editor
- Markdown-rendered AI responses
- Loading and error handling
- Clean developer-focused user interface
- Separate frontend and backend architecture

---

## Tech Stack

### Frontend

- React
- JavaScript
- Vite
- Axios
- PrismJS
- React Simple Code Editor
- React Markdown
- Highlight.js

### Backend

- Node.js
- Express.js
- Google Gemini API
- CORS
- dotenv

---

## Project Structure

```text
CodeScope-AI/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   │
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

## How It Works

```text
User enters code
       ↓
React Code Editor
       ↓
Axios POST Request
       ↓
Express.js Backend
       ↓
AI Controller
       ↓
AI Service
       ↓
Google Gemini API
       ↓
AI Code Review
       ↓
Markdown-rendered response
```

The frontend sends the submitted code to the Express backend. The backend securely communicates with the Gemini API and returns the generated review to the frontend.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/CodeScope-AI.git
```

Move into the project:

```bash
cd CodeScope-AI
```

---

## Backend Setup

Move to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory:

```env
GOOGLE_GEMINI_KEY=your_gemini_api_key
```

> Do not commit your `.env` file or API key to GitHub.

Start the backend server:

```bash
npm start
```

The backend runs on:

```text
http://localhost:3000
```

---

## Frontend Setup

Open another terminal and move to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the URL displayed by Vite, typically:

```text
http://localhost:5173
```

---

## API Endpoint

### Review Code

```http
POST /ai/get-response
```

Example request body:

```json
{
  "code": "function sum() { return 1 + 1; }"
}
```

The backend sends the code to the AI model and returns the generated review.

---

## Environment Variables

The project requires a Gemini API key.

Create:

```text
backend/.env
```

Example:

```env
GOOGLE_GEMINI_KEY=your_gemini_api_key
```

Make sure `.env` is included in `.gitignore`.

You can also create a `.env.example` file:

```env
GOOGLE_GEMINI_KEY=your_gemini_api_key_here
```

This allows other developers to understand the required configuration without exposing your actual credentials.

---

## Security

- API keys are stored on the backend and are never exposed directly to the React frontend.
- Environment variables are excluded from Git using `.gitignore`.
- The frontend communicates with Gemini through the Express backend rather than calling the Gemini API directly.
- CORS is configured for frontend-backend communication.

---

## Future Improvements

Potential features planned for future versions:

- Support for multiple programming languages
- User authentication
- Code review history
- GitHub repository integration
- Downloadable review reports
- Code quality scoring
- Review severity indicators
- Side-by-side code suggestions
- Database integration
- Deployment for public access

---

## Author

**Vivek Kumar**

B.Tech Computer Science & Engineering

---

## Disclaimer

AI-generated code reviews may contain mistakes or incomplete suggestions. Developers should verify recommendations before applying them to production code.
