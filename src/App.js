import React, { useState } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import './index.css';
import 'katex/dist/katex.min.css';
import ThemeToggle from './components/theme-toggle';
import { IoCheckmark, IoClose, IoCopy } from 'react-icons/io5';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [copyStatus, setCopyStatus] = useState(null);
  const handleChange = (e) => { setMarkdown(e.target.value); };

  const renderMarkdown = (markdown) => {
    const html = marked(markdown, {
      breaks: true,
      gfm: true,
      renderer: new marked.Renderer(),
    });

    // Regex for LaTeX
    const latexRegex = /(\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$)/g;

    const renderedHtml = html.replace(latexRegex, (match, blockMatch, blockContent, inlineContent) => {
      try {
        if (blockContent !== undefined) {
          return katex.renderToString(blockContent.trim(), { displayMode: true });
        } else if (inlineContent !== undefined) {
          return katex.renderToString(inlineContent.trim(), { displayMode: false });
        }
      } catch (error) {
        // console.error("KaTeX rendering error:", error);
        return `<span class="latex-error">${match}</span>`;
      }
      return match; // Fallback
    });

    // console.log(markdown);
    console.log(renderedHtml);
    return renderedHtml;


  };

  const copyToClipboard = () => {
    const html = renderMarkdown(markdown);
    navigator.clipboard.writeText(html)
      .then(() => {
        setCopyStatus('success');
        setTimeout(() => setCopyStatus(null), 2000); // Reset status after 2 seconds
      })
      .catch(() => {
        setCopyStatus('failure');
        setTimeout(() => setCopyStatus(null), 2000); // Reset status after 2 seconds
      });
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-[#EBECF0] dark:bg-[#272727] dark:text-[#ceced2]">
      <header className='flex items-center justify-between'>
        <h1 className="my-4 font-mono text-3xl tracking-wide text-center small-caps">
          Markdown Previewer
        </h1>
        <div className="flex items-center gap-x-2 space-around" id="btns">
          <ThemeToggle />
          <button
            onClick={copyToClipboard}
            className="flex items-center p-2 ml-2 transition-colors duration-300 rounded-full text-[1em] bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
            aria-label="Copy HTML"
          >
            {copyStatus === 'success' ? (
              <IoCheckmark className="text-green-600" />
            ) : copyStatus === 'failure' ? (
              <IoClose className="text-red-600" />
            ) : (
              <IoCopy className="text-black dark:text-white" />
            )}
          </button>
        </div>
      </header>
      <div className="flex flex-col flex-1 gap-4 lg:flex-row">
        <textarea
          className="flex-1 dark:bg-[#2D2D2D] rounded p-3 my-3 resize-none overflow-y-auto dark:text-white"
          value={markdown}
          onChange={handleChange}
          placeholder="Enter your markdown here"
        />
        <div id="output" className="flex-1 px-3 py-2 my-3 overflow-y-auto break-words rounded resize-none !border-gray-300 dark:!border-gray-600">
          <div
            className="no-tw"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(markdown),
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
