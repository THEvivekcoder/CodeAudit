# CodeAudit

> AI-powered code review platform that analyzes source code and provides
> actionable feedback on bugs, security, performance, readability, and
> code quality.

[![Live
Demo](https://img.shields.io/badge/Live%20Demo-CodeAudit-6c5ce7?style=for-the-badge)](https://code-audit-five.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/THEvivekcoder/CodeAudit)

**Live Demo:** https://code-audit-five.vercel.app/\
**Repository:** https://github.com/THEvivekcoder/CodeAudit

------------------------------------------------------------------------

## Overview

**CodeAudit** is a web-based AI code review application built to help
developers quickly understand potential problems in their code.

Users can paste their source code into the editor and request an
AI-powered review. The backend sends the submitted code to the Google
Gemini API using a predefined review prompt and returns a structured
response that is rendered in the frontend.

The application is designed around a simple workflow:

**Write/Paste Code → AI Review → Understand Issues → Improve Code →
Download Review**

------------------------------------------------------------------------

## Features

-   🤖 **AI-powered code review**
    -   Uses Google Gemini for code analysis.
    -   Generates structured, developer-focused feedback.
-   🐛 **Bug detection**
    -   Highlights potential logical and implementation issues.
-   🔐 **Security analysis**
    -   Identifies potential security concerns in submitted code.
-   ⚡ **Performance suggestions**
    -   Suggests ways to improve inefficient code.
-   ✨ **Code quality recommendations**
    -   Provides readability, maintainability, and best-practice
        suggestions.
-   💻 **Syntax-highlighted code editor**
    -   Provides a clean environment for entering source code.
-   📝 **Markdown-rendered reviews**
    -   AI responses are displayed with readable formatting and
        highlighted code blocks.
-   📋 **Copy review**
    -   Copy the generated AI review with one click.
-   📄 **Download review as PDF**
    -   Download the submitted code and generated AI review as a PDF
        report.
-   ⏳ **Loading and error states**
    -   Clear feedback while the AI review is being generated or when an
        error occurs.
-   📱 **Responsive UI**
    -   Designed to work across desktop, tablet, and mobile screen
        sizes.

------------------------------------------------------------------------

## Live Demo

Try CodeAudit online:

**https://code-audit-five.vercel.app/**

------------------------------------------------------------------------

## How It Works

``` text
User enters code
       │
       ▼
React Code Editor
       │
       ▼
Axios POST Request
       │
       ▼
Express.js Backend
       │
       ▼
Predefined Code Review Prompt
       │
       ▼
Google Gemini API
       │
       ▼
AI-generated Code Review
       │
       ▼
Markdown-rendered Review
       │
       ├──────────────► Copy Review
       │
       └──────────────► Download Review as PDF
```

The Gemini API is accessed through the backend rather than directly from
the frontend, keeping the API key server-side.

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   React
-   JavaScript
-   Vite
-   Axios
-   PrismJS
-   React Simple Code Editor
-   React Markdown
-   Highlight.js
-   CSS

### Backend

-   Node.js
-   Express.js
-   Google Gemini API
-   CORS
-   dotenv

------------------------------------------------------------------------

## Project Structure

``` text
CodeAudit/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── utils/
│   │   │   └── generateReviewPDF.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── package.json
│   └── ...
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

------------------------------------------------------------------------

## Getting Started

### Prerequisites

Make sure you have installed:

-   [Node.js](https://nodejs.org/)
-   npm
-   A Google Gemini API key

### 1. Clone the repository

``` bash
git clone https://github.com/THEvivekcoder/CodeAudit.git
cd CodeAudit
```

### 2. Install frontend dependencies

``` bash
cd Frontend
npm install
```

### 3. Install backend dependencies

Open another terminal:

``` bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` directory.

Use the environment variable expected by the backend:

``` env
GOOGLE_GEMINI_KEY=your_gemini_api_key
```

> Keep your API key private. Never commit `.env` or secret credentials
> to GitHub.

### 5. Start the backend

From the `backend` directory:

``` bash
npm start
```

### 6. Start the frontend

From the `Frontend` directory:

``` bash
npm run dev
```

Vite will provide the local development URL in the terminal, typically:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## Usage

1.  Open CodeAudit.
2.  Paste your source code into the editor.
3.  Select the available programming language.
4.  Click **Review Code**.
5.  Wait for the AI-generated analysis.
6.  Read the review for:
    -   Bugs
    -   Security issues
    -   Performance concerns
    -   Code quality
    -   Best-practice improvements
7.  Copy the review if needed.
8.  Download the code and review as a PDF report.

------------------------------------------------------------------------

## Backend API

### Review Code

``` http
POST /ai/get-response
```

Example request:

``` json
{
  "code": "function sum() { return 1 + 1; }"
}
```

The backend processes the submitted code through the configured AI
review workflow and returns the generated review.

------------------------------------------------------------------------

## Environment Variables

The backend requires a Gemini API key.

``` env
GOOGLE_GEMINI_KEY=your_gemini_api_key
```

For local development, create:

``` text
backend/.env
```

Do not commit this file to the repository.

For collaborators, you can provide a safe template such as:

``` text
backend/.env.example
```

with:

``` env
GOOGLE_GEMINI_KEY=your_gemini_api_key_here
```

------------------------------------------------------------------------

## Security Notes

-   Keep Gemini API credentials on the backend.
-   Never expose API keys in frontend code.
-   Never commit `.env` files containing real credentials.
-   Treat AI-generated reviews as recommendations that should be
    verified before being applied to production code.

------------------------------------------------------------------------

## Future Improvements

Potential improvements for future versions include:

-   🌐 Support for more programming languages
-   🔐 User authentication
-   📚 Review history
-   🔗 GitHub repository integration
-   📊 Code quality scoring
-   🚨 Review severity levels
-   💡 Side-by-side code suggestions
-   🗄️ Database-backed review history
-   🔄 Improved review customization
-   📈 More detailed code analytics

------------------------------------------------------------------------

## Disclaimer

AI-generated code reviews can contain mistakes, incomplete suggestions,
or false positives.

Always verify recommendations and test code before applying AI-generated
changes to production systems.

------------------------------------------------------------------------

## Contributing

Contributions, suggestions, and improvements are welcome.

### Basic workflow

``` bash
git clone https://github.com/THEvivekcoder/CodeAudit.git
cd CodeAudit
```

Create a feature branch:

``` bash
git checkout -b feature/your-feature
```

Make your changes, test them, and submit a pull request.

------------------------------------------------------------------------

## License

This project does not currently specify a license. If you intend to
allow reuse or contributions under specific terms, add an appropriate
`LICENSE` file to the repository.

------------------------------------------------------------------------

## Links

-   **Live Application:** https://code-audit-five.vercel.app/
-   **GitHub Repository:** https://github.com/THEvivekcoder/CodeAudit
