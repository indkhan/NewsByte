export function truncateText(text: string, wordCount: number): string {
  if (!text) return '';
  
  const words = text.split(/\s+/);
  if (words.length <= wordCount) return text;
  
  return words.slice(0, wordCount).join(' ') + '...';
}