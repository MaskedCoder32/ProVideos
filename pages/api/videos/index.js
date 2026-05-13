import dbConnect from '../../../lib/mongodb';
import Video from '../../../models/Video';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const videos = await Video.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: videos });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch videos' });
    }
  } 
  
  else if (req.method === 'POST') {
    // 1. Check Password
    if (req.headers.authorization !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Wrong Admin Password' });
    }
    
    // 2. Save to Database
    try {
      const video = await Video.create(req.body);
      res.status(201).json({ success: true, data: video });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Database saving error. Check MongoDB setup.' });
    }
  }
}
