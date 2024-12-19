import { IncomingForm, Files } from 'formidable';
import { promises as fs } from 'fs';
import pdf from 'pdf-parse';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FilesObject {
  pdf1?: Express.Multer.File[];
  pdf2?: Express.Multer.File[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  try {
    const form = new IncomingForm();

    form.parse(req, async (err: any, fields: { [key: string]: string | string[] }, files: FilesObject) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      const pdf1File: any = files.pdf1 ? files.pdf1[0] : undefined;
      const pdf2File: any = files.pdf2 ? files.pdf2[0] : undefined;

      if (!pdf1File || !pdf2File) {
        return res.status(400).json({ error: 'Both PDF files must be uploaded.' });
      }

      try {
        const pdf1Buffer = await fs.readFile(pdf1File.filepath);
        const pdf2Buffer = await fs.readFile(pdf2File.filepath);

        const text1 = await pdf(pdf1Buffer);
        const text2 = await pdf(pdf2Buffer);
        
        res.status(200).json({
          text1: text1.text,
          text2: text2.text,
          numPages: Math.max(text1.numpages, text2.numpages)
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
