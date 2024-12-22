import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import pdf from 'pdf-parse';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument } from 'pdf-lib';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  try {
    const form = new IncomingForm();

    form.parse(req, async (err: any, fields:any, files: any) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      const pdf1File = files.pdf1 ? files.pdf1[0] : undefined;
      const pdf2File = files.pdf2 ? files.pdf2[0] : undefined;

      if (!pdf1File || !pdf2File) {
        return res.status(400).json({ error: 'Both PDF files must be uploaded.' });
      }

      try {
        // Read file buffers
        const pdf1Buffer = await fs.readFile(pdf1File.filepath);
        const pdf2Buffer = await fs.readFile(pdf2File.filepath);

        // Extract text in chunks
        const extractTextInChunks = async (pdfBuffer: Buffer) => {
          const pdfDoc = await PDFDocument.load(pdfBuffer);
          const pageCount = pdfDoc.getPageCount();
          const chunks: Record<string, string> = {};
          let num = 0;
          for (let i = 0; i < pageCount; i += 10) {
            num++;
            const chunkDoc = await PDFDocument.create();
            const end = Math.min(i + 10, pageCount);

            const pagesToCopy = await chunkDoc.copyPages(
              pdfDoc,
              Array.from({ length: end - i }, (_, idx) => i + idx)
            );
            pagesToCopy.forEach((page) => chunkDoc.addPage(page));

            const chunkBuffer = await chunkDoc.save();
            const chunkText = await pdf(chunkBuffer);

            chunks[num] = chunkText.text;                   
          }
          num = 0;
          return chunks;
        };

        const pdf1TextChunks = await extractTextInChunks(pdf1Buffer);
        const pdf2TextChunks = await extractTextInChunks(pdf2Buffer);
        
        // Extract full text
        const text1 = await pdf(pdf1Buffer);
        const text2 = await pdf(pdf2Buffer);
        console.log("lenght",Math.max(Object.keys(pdf1TextChunks).length,Object.keys(pdf2TextChunks).length));
        
        res.status(200).json({
          text1: text1.text,
          text2: text2.text,
          numPages: Math.max(Object.keys(pdf1TextChunks).length,Object.keys(pdf2TextChunks).length),
          pdf1Texts: pdf1TextChunks,
          pdf2Texts: pdf2TextChunks,
          
        });
      } catch (err: any) {
        console.error('Error processing PDFs:', err.message);
        res.status(500).json({ error: 'Failed to process PDF files', message: err.message });
      }
    });
  } catch (err: any) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
