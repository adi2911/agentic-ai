import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import callRoutes from './routes/call.routes.js';
import { startProcessor } from './services/processor.js';
const { MONGO_URI, PORT = 5000 } = process.env;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/calls', callRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }));

mongoose
  .connect(MONGO_URI, { dbName: 'omindDB' })
  .then(() => {
    console.log(' Mongo connected');
    app.listen(PORT, () => console.log(`  API ready at http://localhost:${PORT}`));
    startProcessor(Number(process.env.PROCESSOR_POLL_INTERVAL) || 5050);
  })
  .catch((err) => {
    console.error(' Mongo connect failed:', err);
    process.exit(1);
  });
