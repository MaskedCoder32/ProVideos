import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  telegramChannelId: { type: String, required: true }, // e.g. -10012345678
  telegramMessageId: { type: String, required: true }, // e.g. 45
  duration: { type: String, default: '00:00' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
