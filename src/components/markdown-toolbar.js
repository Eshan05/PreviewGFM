import React from 'react';
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { MdCode, MdFormatBold, MdFormatItalic, MdFormatListBulleted, MdFormatListNumbered, MdFormatQuote, MdFormatStrikethrough, MdImage, MdLineWeight, MdLink } from "react-icons/md";

const MarkdownToolbar = ({ onFormat }) => {
  const handleFormat = (format) => { onFormat(format); };

  return (
    <div className="flex p-2 space-x-2 markdown-toolbar btns *:dark:bg-neutral-700 *:bg-neutral-300 *:border-none *:dark:text-white *:text-base *:text-black">
      <button onClick={() => handleFormat('h1')} aria-label="Heading 1"><LuHeading1 /></button>
      <button onClick={() => handleFormat('h2')} aria-label="Heading 2"><LuHeading2 /></button>
      <button onClick={() => handleFormat('h3')} aria-label="Heading 3"><LuHeading3 /></button>
      <button onClick={() => handleFormat('bold')} aria-label="Bold"><MdFormatBold /></button>
      <button onClick={() => handleFormat('italic')} aria-label="Italic"><MdFormatItalic /></button>
      <button onClick={() => handleFormat('strike')} aria-label="Strikethrough"><MdFormatStrikethrough /></button>
      <button onClick={() => handleFormat('quote')} aria-label="Quote"><MdFormatQuote /></button>
      <button onClick={() => handleFormat('code')} aria-label="Code"><MdCode /></button>
      <button onClick={() => handleFormat('ul')} aria-label="Unordered List"><MdFormatListBulleted /></button>
      <button onClick={() => handleFormat('ol')} aria-label="Ordered List"><MdFormatListNumbered /></button>
      <button onClick={() => handleFormat('link')} aria-label="Link"><MdLink /></button>
      <button onClick={() => handleFormat('image')} aria-label="Image"><MdImage /></button>
      <button onClick={() => handleFormat('hr')} aria-label="Horizontal Rule"><MdLineWeight /></button>
    </div>
  );
};

export default MarkdownToolbar;
