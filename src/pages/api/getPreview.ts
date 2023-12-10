import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(404).json({ message: 'Route Not found' });
    return;
  }

  const { fileName } = req.query;

  if (!fileName) {
    res.status(200).json({
      message: 'The preview link has expired or the filename is wrong',
    });
    return;
  }

  // check if fileName has .md extension
  const isMd = fileName.includes('.md');

  if (isMd) {
    // read the content of the markdown file
    const fileContent = fs.readFileSync(`./public/${fileName}`, 'utf-8');

    // send the file content as a response
    res.setHeader('Content-Type', 'application/json').status(200).send({
      message: 'ok',
      fileContent,
    });

    return;
  }

  // read the content of the html file
  const fileContent = fs.readFileSync(`./public/${fileName}`, 'utf-8');

  res.setHeader('Content-Type', 'application/json').status(200).send({
    message: 'ok',
    fileContent,
  });

  return;
}
