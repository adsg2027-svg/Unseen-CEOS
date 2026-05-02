/**
 * Lightweight markdown renderer for Gemini AI output.
 * Handles: headings (# ## ###), bold (**text**), italic (*text*),
 * unordered lists (- item / * item), numbered lists (1. item),
 * inline code (`code`), horizontal rules (---), and blank-line paragraphs.
 * No external dependencies.
 */

function parseInline(text, keyPrefix) {
  // Split on bold, italic, or inline-code spans
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-i${i}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key} className="font-semibold text-warm-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={key} className="bg-warm-200 text-warm-800 px-1 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function parseMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;
  let listItems = [];
  let listType = null; // 'ul' | 'ol'
  let listKey = 0;

  function flushList() {
    if (listItems.length === 0) return;
    const Tag = listType === 'ol' ? 'ol' : 'ul';
    const listClass = listType === 'ol'
      ? 'list-decimal list-outside ml-5 my-2 space-y-0.5'
      : 'list-disc list-outside ml-5 my-2 space-y-0.5';
    elements.push(
      <Tag key={`list-${listKey++}`} className={listClass}>
        {listItems.map((item, idx) => (
          <li key={idx} className="text-sm text-warm-700 leading-relaxed pl-1">
            {parseInline(item, `li-${listKey}-${idx}`)}
          </li>
        ))}
      </Tag>
    );
    listItems = [];
    listType = null;
  }

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line
    if (trimmed === '') {
      flushList();
      // Only add spacing element if next non-blank line exists
      if (elements.length > 0) {
        elements.push(<div key={`sp-${i}`} className="h-2" />);
      }
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      flushList();
      elements.push(<hr key={`hr-${i}`} className="border-warm-200 my-3" />);
      i++;
      continue;
    }

    // H1
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h3 key={`h1-${i}`} className="text-base font-bold text-warm-900 mt-4 mb-1 first:mt-0">
          {parseInline(trimmed.slice(2), `h1-${i}`)}
        </h3>
      );
      i++;
      continue;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h4 key={`h2-${i}`} className="text-sm font-bold text-warm-900 mt-3 mb-1">
          {parseInline(trimmed.slice(3), `h2-${i}`)}
        </h4>
      );
      i++;
      continue;
    }

    // H3
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h5 key={`h3-${i}`} className="text-sm font-semibold text-warm-800 mt-2 mb-0.5">
          {parseInline(trimmed.slice(4), `h3-${i}`)}
        </h5>
      );
      i++;
      continue;
    }

    // Unordered list item
    const ulMatch = trimmed.match(/^[-*+] (.+)/);
    if (ulMatch) {
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(ulMatch[1]);
      i++;
      continue;
    }

    // Ordered list item
    const olMatch = trimmed.match(/^\d+\. (.+)/);
    if (olMatch) {
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(olMatch[1]);
      i++;
      continue;
    }

    // Plain paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="text-sm text-warm-700 leading-relaxed">
        {parseInline(trimmed, `p-${i}`)}
      </p>
    );
    i++;
  }

  flushList();
  return elements;
}

export default function MarkdownRenderer({ children, className = '' }) {
  const content = typeof children === 'string' ? children : '';
  const elements = parseMarkdown(content);
  return <div className={`space-y-0.5 ${className}`}>{elements}</div>;
}
