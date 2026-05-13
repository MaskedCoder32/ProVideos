import dbConnect from '../../../lib/mongodb';
import Video from '../../../models/Video';

export default async function handler(req, res) {
  const { id } = req.query;
  const range = req.headers.range;

  await dbConnect();
  const video = await Video.findById(id);

  if (!video) return res.status(404).send('Video not found');

  try {
    // 1. Get file path from Telegram (Works for files < 20MB)
    const tgApiRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${video.telegramFileId}`);
    const tgData = await tgApiRes.json();

    if (!tgData.ok) throw new Error('Failed to get file from Telegram');

    const filePath = tgData.result.file_path;
    const streamUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;

    // 2. Fetch the actual file and pipe it to the client supporting Range requests for seeking
    const fetchOptions = range ? { headers: { Range: range } } : {};
    const videoResponse = await fetch(streamUrl, fetchOptions);

    res.status(videoResponse.status);
    videoResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Pipe the standard node stream
    videoResponse.body.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error while streaming');
  }
}