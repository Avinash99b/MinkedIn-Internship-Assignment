import sanitizeHtml from 'sanitize-html';

export function sanitizeMarkdownText(text: string) {
  return sanitizeHtml(text, {
    allowedTags: [], // allow pure text
    allowedAttributes: {}
  });
}
