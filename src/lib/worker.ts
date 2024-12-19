import pdf from 'pdf-parse';
import { diffWords } from 'diff';

onmessage = async (e) => {
  const { pdf1Buffer, pdf2Buffer, page, paginationSize } = e.data;

  try {
    // Parse the PDFs
    const text1 = await pdf(pdf1Buffer);
    const text2 = await pdf(pdf2Buffer);

    // Calculate the previous percentage for the current page
    const previousPercentage = (page - 1) * paginationSize;

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

    const text1Chunk = getLimitedWords(text1.text, previousPercentage + paginationSize, previousPercentage);
    const text2Chunk = getLimitedWords(text2.text, previousPercentage + paginationSize, previousPercentage);

    // Calculate the diff between the two texts for the given chunk
    const diff = diffWords(text1Chunk, text2Chunk);

    postMessage({ diff }); // Send the result back to the main thread
  } catch (err: any) {
    postMessage({ error: 'Failed to process PDF files', message: err.message });
  }
};
