import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { addClassesToParsedHtml } from '@/utils/addClassesToParsedHtml';

const S3 = new S3Client({
  region: 'auto',
  endpoint: 'https://pub-5a5ad54108aa4d5ea61fd462f29c6885.r2.dev',
  credentials: {
    accessKeyId: 'fc124871299ae3063c5c2ba7e8c4483f',
    secretAccessKey: 'fc124871299ae3063c5c2ba7e8c4483f',
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(404).json({ message: 'Route Not found' });
    return;
  }

  const { type, doc } = req.body;

  if (!type || !doc) {
    res.status(400).json({ message: 'Missing type or doc' });
    return;
  }

  console.log(
    await S3.send(new ListObjectsV2Command({ Bucket: 'preview-files' }))
  );

  if (type === 'md') {
    // get current date and time in iso format
    const date = new Date().toISOString();

    // store the markdown file in the public folder with the current date and time as the file name

    fs.writeFile(`./public/${date}.md`, doc, (err) => {
      if (err) {
        res.status(500).json({ message: 'Error saving file' });
        return;
      }

      res.status(201).json({
        message: 'File saved successfully',
        fileName: `${date}.md`,
      });
    });

    // delete the file after 2 hours
    setTimeout(() => {
      fs.unlink(`./public/${date}.md`, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`./public/${date}.md was deleted`);
      });
    }, 7200000);

    return;
  }
  const date = new Date().toISOString();

  fs.writeFile(`./public/${date}.html`, addClassesToParsedHtml(doc), (err) => {
    if (err) {
      res.status(500).json({ message: 'Error saving file' });
      return;
    }

    res.status(201).json({
      message: 'File saved successfully',
      fileName: `${date}.html`,
    });
  });

  // delete the file after 60 seconds
  setTimeout(() => {
    fs.unlink(`./public/${date}.html`, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`./public/${date}.html was deleted`);
    });
  }, 7200000);
}
