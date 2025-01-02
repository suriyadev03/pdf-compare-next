import { diffWords } from 'diff';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { pdf1PageText, pdf2PageText } = req.body;

  if (!pdf1PageText && !pdf2PageText) {
    return res.status(400).json({ error: 'Missing text1, text2, or nextPage data' });
  }

  try {
    const diff = diffWords(pdf1PageText || '', pdf2PageText || '')
    

    res.status(200).json({
       diff
    });
  } catch (err: any) {
    console.error('Error computing diff:', err.message);
    res.status(500).json({ error: 'Failed to compute diff', message: err.message });
  }
}
