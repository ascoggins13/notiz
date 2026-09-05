import 'express-async-errors';
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { requireAuth } from './middleware/auth';
import { checkinsRouter } from './routes/checkins';
import { matchesRouter } from './routes/matches';
import { noticesRouter } from './routes/notices';
import { usersRouter } from './routes/users';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const origins = process.env.ALLOWED_ORIGINS === '*' ? true : process.env.ALLOWED_ORIGINS?.split(',');

app.use(helmet());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 100, standardHeaders: true, legacyHeaders: false }));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'notiz-api' }));
app.use('/api/users', requireAuth, usersRouter);
app.use('/api/checkins', requireAuth, checkinsRouter);
app.use('/api/notices', requireAuth, noticesRouter);
app.use('/api/matches', requireAuth, matchesRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(port, '0.0.0.0', () => console.log(`Notiz API listening on ${port}`));
