import { useState } from "react";

import _Editor from "react-simple-code-editor";
const Editor = _Editor.default ?? _Editor;

import {
  highlight,
  languages,
} from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import axios from "axios";
import "./App.css";


function App() {

  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);


  async function reviewCode() {

    if (!code.trim()) {
      setReview("Please enter some code first.");
      return;
    }

    try {

      setLoading(true);
      setReview("");

      const response = await axios.post(
        "http://localhost:3000/ai/get-response",
        {
          code: code,
        }
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
  }


  return (

    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="brand">

          <div className="brandIcon">
            &lt;/&gt;
          </div>

          <div>
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
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="githubButton"
          >
            GitHub
          </a>

        </div>

      </nav>


      {/* MAIN */}

      <main className="workspace">


        {/* LEFT PANEL */}

        <section className="panel editorPanel">


          {/* PANEL HEADER */}

          <div className="panelHeader">

            <div className="panelTitle">

              <span className="panelIcon">
                &lt;/&gt;
              </span>

              <div>
                <h2>Code Editor</h2>
                <p>Paste your code for analysis</p>
              </div>

            </div>


            <div className="editorActions">

              <select className="languageSelect">
                <option>JavaScript</option>
              </select>

              <button
                className="clearButton"
                onClick={clearCode}
              >
                Clear
              </button>

            </div>

          </div>


          {/* FILE BAR */}

          <div className="fileBar">

            <div className="fileName">
              <span className="jsIcon">JS</span>
              main.js
            </div>

            <span className="lineCount">
              {code.split("\n").length} lines
            </span>

          </div>


          {/* CODE EDITOR */}

          <div className="editorContainer">

            <Editor

              value={code}

              onValueChange={(newCode) =>
                setCode(newCode)
              }

              highlight={(code) =>
                highlight(
                  code,
                  languages.js
                )
              }

              padding={22}

              textareaClassName="codeTextarea"

              style={{
                fontFamily:
                  '"SFMono-Regular", Consolas, "Liberation Mono", monospace',

                fontSize: 15,

                lineHeight: 1.7,

                minHeight: "100%",
              }}

            />

          </div>


          {/* EDITOR FOOTER */}

          <div className="editorFooter">

            <div className="editorInfo">
              <span>JavaScript</span>
              <span>UTF-8</span>
            </div>


            <button
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



        {/* RIGHT PANEL */}

        <section className="panel reviewPanel">


          {/* REVIEW HEADER */}

          <div className="panelHeader">

            <div className="panelTitle">

              <span className="aiIcon">
                ✦
              </span>

              <div>
                <h2>AI Review</h2>
                <p>
                  Bugs, security & improvements
                </p>
              </div>

            </div>


            {review && (

              <button
                className="copyButton"
                onClick={() =>
                  navigator.clipboard.writeText(review)
                }
              >
                Copy
              </button>

            )}

          </div>



          {/* REVIEW CONTENT */}

          <div className="reviewContent">


            {loading ? (

              <div className="loadingState">

                <div className="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <h3>Reviewing your code</h3>

                <p>
                  Checking bugs, security,
                  performance and code quality...
                </p>

              </div>


            ) : review ? (

              <div className="markdown">

                <Markdown
                  rehypePlugins={[
                    rehypeHighlight
                  ]}
                >
                  {review}
                </Markdown>

              </div>


            ) : (

              <div className="emptyState">

                <div className="emptyIcon">
                  ✦
                </div>

                <h3>
                  Ready to review your code
                </h3>

                <p>
                  Paste your code in the editor and
                  let AI analyze it for bugs,
                  security issues and improvements.
                </p>


                <div className="features">

                  <div>
                    <span>✓</span>
                    Bug detection
                  </div>

                  <div>
                    <span>✓</span>
                    Security analysis
                  </div>

                  <div>
                    <span>✓</span>
                    Performance
                  </div>

                  <div>
                    <span>✓</span>
                    Best practices
                  </div>

                </div>

              </div>

            )}

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer>

        <span>
          CodeScope AI
        </span>

        <span>
          AI-generated reviews may contain mistakes.
        </span>

      </footer>

    </div>

  );
}


export default App;