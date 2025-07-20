/** Roughly split text by sentences so each chunk ≤ maxChars (defaults ~12 k tokens). */
export const splitIntoChunks = (text, maxChars = 12000) => {
  if (text.length <= maxChars) return [text];
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let current = '';
  for (const s of sentences) {
    if ((current + s).length > maxChars) {
      chunks.push(current);
      current = s;
    } else current += s + ' ';
  }
  if (current) chunks.push(current.trim());
  return chunks;
};
