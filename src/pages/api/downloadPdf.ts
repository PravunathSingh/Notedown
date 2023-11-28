// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { convertTailwindClassesToCss } from '@/apiUtils/convertTailwindClassesToCss';
import puppeteer from 'puppeteer';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fileName, doc } = req.body;
  if (!fileName || !doc) {
    res.status(400).json({ message: 'Missing fileName or doc' });
  }

  const htmlWithStyles = convertTailwindClassesToCss(doc);

  (async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.setContent(htmlWithStyles);
    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
      path: `./public/${fileName}.pdf`,
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
    });

    await browser.close();

    // send the pdf as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}.pdf`
    );
    res.send(pdf);
  })();
}
