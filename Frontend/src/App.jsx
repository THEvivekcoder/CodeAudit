import { useState } from "react";

import _Editor from "react-simple-code-editor";
const Editor = _Editor.default ?? _Editor;

import {
  highlight,
  languages,
} from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-solarizedlight.css";

import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

import axios from "axios";
import "./App.css";

import { generateReviewPDF } from "./utils/generateReviewPDF";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);

  const [review, setReview]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError]   = useState("");

  async function reviewCode() {
    if (!code.trim()) {
      setReview("Please enter some code first.");
      return;
    }

    try {
      setLoading(true);
      setReview("");

      const response = await axios.post(
        "https://codeaudit-t382.onrender.com/ai/get-response",
        { code }
      );

      setReview(response.data);
    } catch (error) {
      console.error("Review Error:", error);
      setReview(
        error.response?.data?.error ||
          "Unable to review code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearCode() {
    setCode("");
    setReview("");
    setPdfError("");
  }

  async function downloadPDF() {
    setPdfError("");
    setPdfLoading(true);
    try {
      await generateReviewPDF({
        code,
        language: "JavaScript",
        review,
        date: new Date(),
      });
    } catch (err) {
      console.error("PDF generation error:", err);
      setPdfError("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="app">

      {/* ── NAVBAR ── */}
      <nav className="navbar">

        <div className="brand">
          <div className="brandIcon">&lt;/&gt;</div>
          <div className="brandText">
            <h1>CodeScope</h1>
            <span>AI Code Reviewer</span>
          </div>
        </div>

        <div className="navRight">
          <div className="status">
            <span className="statusDot"></span>
            AI Online
          </div>
          <a
            href="https://github.com/THEvivekcoder/CodeAudit"
            target="_blank"
            rel="noreferrer"
            className="githubButton"
          >
            GitHub
          </a>
        </div>

      </nav>

      {/* ── WORKSPACE ── */}
      <main className="workspace">

        {/* LEFT — CODE EDITOR */}
        <section className="panel editorPanel">

          <div className="panelHeader">
            <div className="panelTitle">
              <span className="panelIcon">&lt;/&gt;</span>
              <div>
                <h2>Code Editor</h2>
                <p>Paste your code for analysis</p>
              </div>
            </div>

            <div className="editorActions">
              <button type="button" className="clearButton" onClick={clearCode}>
                Clear
              </button>
            </div>
          </div>

          <div className="editorContainer">
            <Editor
              value={code}
              onValueChange={(newCode) => setCode(newCode)}
              highlight={(codeValue) => highlight(codeValue, languages.js)}
              padding={22}
              textareaClassName="codeTextarea"
              style={{
                fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
                fontSize: 14,
                lineHeight: 1.75,
                minHeight: "100%",
              }}
            />
          </div>

          <div className="editorFooter">
            <div className="editorInfo">
              <span>JavaScript</span>
              <span>UTF-8</span>
            </div>
            <button
              type="button"
              className="reviewButton"
              onClick={reviewCode}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>✦</span>
                  Review Code
                </>
              )}
            </button>
          </div>

        </section>

        {/* RIGHT — AI REVIEW */}
        <section className="panel reviewPanel">

          <div className="panelHeader">
            <div className="panelTitle">
              <span className="aiIcon">✦</span>
              <div>
                <h2>AI Review</h2>
                <p>Bugs, security &amp; improvements</p>
              </div>
            </div>

            {review && (
              <button
                type="button"
                className="copyButton"
                onClick={() => navigator.clipboard.writeText(review)}
              >
                Copy
              </button>
            )}
          </div>

          <div className="reviewContent">

            {loading ? (

              <div className="loadingState">
                <div className="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <h3>Reviewing your code</h3>
                <p>Checking bugs, security, performance and code quality...</p>
              </div>

            ) : review ? (

              <div className="markdown">
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {review}
                </Markdown>

                {/* PDF DOWNLOAD */}
                <div className="pdfDownloadWrapper">
                  {pdfError && <p className="pdfError">{pdfError}</p>}
                  <button
                    type="button"
                    className="pdfButton"
                    onClick={downloadPDF}
                    disabled={pdfLoading}
                    aria-label="Download review as PDF"
                  >
                    {pdfLoading ? (
                      <>
                        <span className="pdfSpinner"></span>
                        Generating PDF…
                      </>
                    ) : (
                      <>
                        <span className="pdfIcon">⬇</span>
                        Download Review as PDF
                      </>
                    )}
                  </button>
                </div>
              </div>

            ) : (

              <div className="emptyState">
                <div className="emptyIcon">✦</div>
                <h3>Ready to review your code</h3>
                <p>
                  Paste your code in the editor and let AI analyze it for bugs,
                  security issues and improvements.
                </p>
                <div className="features">
                  <div><span>✓</span> Bug detection</div>
                  <div><span>✓</span> Security analysis</div>
                  <div><span>✓</span> Performance</div>
                  <div><span>✓</span> Best practices</div>
                </div>
              </div>

            )}

          </div>

        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer>
        <span>CodeScope AI</span>
        <span>AI-generated reviews may contain mistakes.</span>
      </footer>

    </div>
  );
}

export default App;
