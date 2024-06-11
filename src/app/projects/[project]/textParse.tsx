import React, { ReactNode } from "react";
import Link from "next/link";

/**
 * Parses a string with markdown style links and line breaks, returning an array of text and Next.js Link components.
 * @param {string | null | undefined} text - The string containing markdown style links.
 * @returns {Array<ReactNode>} - An array of strings, React elements, and line breaks.
 */
function parseText(text: string | null | undefined): ReactNode[] {
  if (!text) {
    return [];
  }

  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let parts: ReactNode[] = [];
  let lastIndex = 0;

  text.replace(
    regex,
    (match, linkText: string, href: string, index: number) => {
      // Push text before link (process line breaks within this text)
      const textBeforeLink = text.slice(lastIndex, index);
      parts.push(...formatTextWithLineBreaks(textBeforeLink, false));
      // Push link
      parts.push(
        <Link
          key={href}
          href={href}
          className=" text-blue-600 hover:text-blue-700 hover:underline dark:text-yellow-200 dark:hover:text-yellow-300 "
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </Link>
      );
      lastIndex = index + match.length;
      return match; // Necessary for replace function to work correctly, although the return value is not used.
    }
  );

  // Push remaining text after the last link and process line breaks
  if (lastIndex < text.length) {
    parts.push(...formatTextWithLineBreaks(text.slice(lastIndex), true));
  }

  return parts;
}

/**
 * Replaces line breaks in text with <br /> elements.
 * @param {string} text - Text potentially containing line breaks.
 * @param {boolean} addFinalBreak - Whether to add a final <br /> tag at the end of the text.
 * @returns {Array<ReactNode>} - Text split into lines, each optionally followed by a <br /> tag.
 */
const formatTextWithLineBreaks = (
  text: string,
  addFinalBreak: boolean
): ReactNode[] => {
  const lines = text.split("\n");
  return lines.flatMap((line, index) => [
    line,
    (index < lines.length - 1 || addFinalBreak) && <br key={index} />,
  ]);
};

export default parseText;
