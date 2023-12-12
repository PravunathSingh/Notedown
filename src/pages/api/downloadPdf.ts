// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  const { fileName, doc } = req.body;
  if (!fileName || !doc) {
    res.status(400).json({ message: 'Missing fileName or doc' });
  }

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.NEXT_PUBLIC_BROWSERLESS_TOKEN}`,
  });

  const page = await browser.newPage();
  await page.setContent(doc);
  await page.emulateMediaType('screen');

  // generate a pdf and save it to the public folder
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
  });

  await browser.close();

  // send the pdf name and path as a response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
  res.send(pdf);
}
