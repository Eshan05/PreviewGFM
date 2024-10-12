import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import './index.css';
import 'katex/dist/katex.min.css';
import ThemeToggle from './components/theme-toggle';
import { IoCheckmark, IoClose, IoCopy } from 'react-icons/io5';
import MarkdownToolbar from './components/markdown-toolbar';
import { MdMobileFriendly } from 'react-icons/md';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [copyStatus, setCopyStatus] = useState(null);
  const [currentWidthIndex, setCurrentWidthIndex] = useState(0);
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
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch(() => {
        setCopyStatus('failure');
        setTimeout(() => setCopyStatus(null), 2000);
      });
  };

  const applyMarkdownFormat = (format) => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    const lines = markdown.split('\n');
    const currentLineIndex = textarea.value.substr(0, start).split('\n').length - 1; // Current line index
    const currentLine = lines[currentLineIndex];
    console.log("Start:", start, "End:", end, "Selected Text:", selectedText);

    let newText;

    switch (format) {
      case 'h1': newText = `# ${currentLine.trim()}`; break;
      case 'h2': newText = `## ${currentLine.trim()}`; break;
      case 'h3': newText = `### ${currentLine.trim()}`; break;
      case 'bold': newText = selectedText ? `**${selectedText}**` : '**B**'; break;
      case 'italic': newText = selectedText ? `*${selectedText}*` : '*italic text*'; break;
      case 'quote': newText = `> ${selectedText.trim() || 'Quote text'}`; break;
      case 'code': newText = selectedText ? `\`${selectedText}\`` : '`code`'; break;
      case 'ul': newText = `- ${currentLine.trim() || 'List item'}`; break;
      case 'ol': newText = `1. ${currentLine.trim() || 'List item'}`; break;
      case 'link': newText = selectedText ? `[${selectedText}](URL)` : '[Link text](URL)'; break;
      case 'image': newText = selectedText ? `![${selectedText}](Image_URL)` : '![alt text](Image_URL)'; break;
      case 'hr': newText = '---'; break;
      default: newText = '';
    }


    if (['h1', 'h2', 'h3', 'quote', 'ul', 'ol'].includes(format)) {
      // Replace the current line
      lines[currentLineIndex] = newText;
    } else {
      // Replace the selected text
      lines[currentLineIndex] = currentLine.replace(selectedText, newText);
    }

    // Update the markdown state with the modified lines
    const newMarkdown = lines.join('\n');
    setMarkdown(newMarkdown);
    setTimeout(() => {
      textarea.selectionStart = start + newText.length; // Move cursor to end of new text
      textarea.selectionEnd = start + newText.length; // Ensure cursor stays in place
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          applyMarkdownFormat('bold');
          break;
        case 'i': e.preventDefault(); applyMarkdownFormat('italic'); break;
        case '1': e.preventDefault(); applyMarkdownFormat('h1'); break;
        case '2': e.preventDefault(); applyMarkdownFormat('h2'); break;
        case '3': e.preventDefault(); applyMarkdownFormat('h3'); break;
        case 'q': e.preventDefault(); applyMarkdownFormat('quote'); break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const widths = [350, 480, 768, 1024];
  const handleChangeWidth = () => {
    // Move to the next width in the array, looping back to the start
    setCurrentWidthIndex((prevIndex) => (prevIndex + 1) % widths.length);
  };


  return (
    <div className="flex flex-col min-h-screen p-4 bg-[#EBECF0] dark:bg-[#272727] dark:text-[#ceced2]">
      <header className='flex items-center justify-between'>
        <h1 className="flex flex-col my-4 font-mono text-3xl tracking-wide text-center">
          <strong className='small-caps'>Markdown Previewer</strong>
          <span className='text-base text-neutral-400 dark:text-neutral-600'>With WYSIWYG Functionality</span>
        </h1>
        <div className="flex items-center gap-x-2" id="header-btns">
          <div className='items-center hidden mr-2 lg:flex gap-x-2'>
            <button
              onClick={handleChangeWidth}
              className="flex items-center p-2 transition-colors duration-300 rounded-full text-[1em] bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
              aria-label="Change Width"
            >
              <MdMobileFriendly className="text-black dark:text-white" />
            </button>
          </div>
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
      <MarkdownToolbar onFormat={applyMarkdownFormat} />
      <div className="relative flex flex-col flex-1 gap-4 lg:flex-row">
        <textarea
          className="flex-1 dark:bg-[#2D2D2D] rounded p-3 my-3 resize-none overflow-y-auto dark:text-white"
          value={markdown}
          onChange={handleChange}
          placeholder="Enter your markdown here"
        />
        <div
          id="output"
          className={`flex-1 lg:flex-none px-3 py-2 my-3 overflow-y-auto break-words rounded resize-none !border-gray-300 dark:!border-gray-600 w-full`}
          style={{ maxWidth: currentWidthIndex >= 0 ? `${widths[currentWidthIndex]}px` : 'auto' }}
        >
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
