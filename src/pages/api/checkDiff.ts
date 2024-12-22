import { diffWords } from 'diff';
import type { NextApiRequest, NextApiResponse } from 'next';

// Function to split the text into smaller chunks based on percentage
const getLimitedWords = (text: string, percentage: number, previousPercentage = 0) => {
  const paragraphs = text.split(/\n+/);
  const totalWords = text.split(/\s+/).length;

  const start = Math.ceil((totalWords * previousPercentage) / 100);
  const end = Math.ceil((totalWords * percentage) / 100);

  let wordCount = 0;
  const result = [];

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.split(/\s+/);

    if (wordCount + paragraphWords.length <= end) {
      if (wordCount >= start) result.push(paragraph);
      wordCount += paragraphWords.length;
    } else {
      const remainingWords = end - wordCount;
      if (remainingWords > 0 && wordCount >= start) {
        result.push(paragraphWords.slice(0, remainingWords).join(' '));
      }
      break;
    }
  }

  return result.join('\n');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { text1, text2, pdf1PageText, pdf2PageText } = req.body;

  if (!text1 || !text2) {
    return res.status(400).json({ error: 'Missing text1, text2, or nextPage data' });
  }

  try {
    const paginationSize = 10;
    const previousPercentage = (1 - 1) * paginationSize;

    const text1Chunk = getLimitedWords(text1, previousPercentage + paginationSize, previousPercentage);
    const text2Chunk = getLimitedWords(text2, previousPercentage + paginationSize, previousPercentage);

    // const diff = previousPercentage < 100 ? diffWords(text1Chunk, text2Chunk) : [];
    const diff = diffWords(pdf1PageText || '', pdf2PageText || '')

    res.status(200).json({
      text1, text2, currentPage: 2, diff
    });
  } catch (err: any) {
    console.error('Error computing diff:', err.message);
    res.status(500).json({ error: 'Failed to compute diff', message: err.message });
  }
}
