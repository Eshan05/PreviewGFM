import React, { useState } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import './index.css'; // Ensure Tailwind is imported
import 'katex/dist/katex.min.css'; // Ensure KaTeX styles are included
import ThemeToggle from './components/theme-toggle';

function App() {
  const [markdown, setMarkdown] = useState('');
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
        console.error("KaTeX rendering error:", error);
        return `<span class="latex-error">${match}</span>`;
      }
      return match; // Fallback
    });

    return renderedHtml;
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-[#EBECF0] dark:bg-[#272727] dark:text-[#ceced2]">
      <header className='flex items-center justify-between'>
        <h1 className="my-4 text-3xl font-bold text-center text-gray-800 dark:text-gray-300">
          Markdown Previewer
        </h1>
        <ThemeToggle />
      </header>
      <div className="flex flex-col flex-1 gap-4 lg:flex-row">
        <textarea
          className="flex-1 dark:bg-[#2D2D2D] rounded-lg p-3 my-3 resize-none"
          value={markdown}
          onChange={handleChange}
          placeholder="Enter your markdown here"
        />
        <div id="output" className="flex-1 px-3 py-2 my-3 overflow-y-auto break-words rounded-lg resize-none">
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
