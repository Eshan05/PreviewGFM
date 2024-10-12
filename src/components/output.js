import React from 'react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MarkdownOutput = ({ markdown }) => {
  const renderMarkdown = (markdown) => {
    const html = marked(markdown, {
      breaks: true,
      gfm: true,
    });

    const latexRegex = /(\$\$([\s\S]*?)\$\$|\$([\s\S]*?)\$)/g;

    return html.replace(latexRegex, (match, blockMatch, blockContent, inlineContent) => {
      try {
        if (blockContent) {
          return katex.renderToString(blockContent.trim(), { displayMode: true });
        } else if (inlineContent) {
          return katex.renderToString(inlineContent.trim(), { displayMode: false });
        }
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        return `<span class="latex-error">${match}</span>`;
      }
      return match; // Fallback
    });
  };

  return (
    <div className="markdown no-tw" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
  );
};

export default MarkdownOutput;
