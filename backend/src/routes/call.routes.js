import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Analysis, Call, CoachingPlan, Transcript } from '../models/index.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) cb(null, true);
    else cb(new Error('Only audio files are allowed'));
  },
});

router.post('/upload', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const demoUserId = '000000000000000000000000';

    const call = await Call.create({
      user: demoUserId,
      filename: req.file.filename,
      status: 'uploaded',
    });

    res.status(201).json({ id: call._id, status: call.status });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const sort = req.query.sort || '-createdAt';

    const [data, total] = await Promise.all([
      Call.find()
        .select('filename status createdAt user')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Call.countDocuments(),
    ]);

    res.json({ page, limit, total, data });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const call = await Call.findById(req.params.id)
      .populate('transcript')
      .populate('analysis')
      .populate('coachingPlan')
      .lean();

    if (!call) return res.status(404).json({ error: 'Call not found' });
    res.json(call);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const call = await Call.findById(req.params.id);
    if (!call) return res.status(404).json({ error: 'Call not found' });

    await Promise.all([
      Transcript.deleteOne({ _id: call.transcript }),
      Analysis.deleteOne({ _id: call.analysis }),
      CoachingPlan.deleteOne({ _id: call.coachingPlan }),
    ]);

    await call.deleteOne();

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
