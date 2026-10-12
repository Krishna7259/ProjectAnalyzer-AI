import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Database } from './server/db.ts';
import { GeminiService } from './server/gemini.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Auth middleware
interface AuthenticatedRequest extends Request {
  user?: any;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const user = Database.getUserByToken(token);
  if (!user) {
    res.status(401).json({ error: 'Session expired or invalid token.' });
    return;
  }

  req.user = user;
  next();
}

// ---------------------------------------------------------------------------
// AUTHENTICATION ROUTES
// ---------------------------------------------------------------------------

app.post('/api/auth/register', (req: Request, res: Response): void => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const { user, token } = Database.createUser(name, email, password);
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const { user, token } = Database.loginUser(email, password);
    res.json({ user, token });
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Invalid email or password.' });
  }
});

app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  res.json({ user: req.user });
});

app.post('/api/auth/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    Database.logout(token);
  }
  res.json({ success: true });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response): void => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      res.status(400).json({ error: 'Email and new password are required.' });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    Database.resetPassword(email, newPassword);
    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to reset password.' });
  }
});

// Demo account auto-login for fast evaluation
app.post('/api/auth/demo', (req: Request, res: Response): void => {
  try {
    const demoEmail = 'developer@projectsanalyzer.ai';
    const demoPassword = 'Password123!';
    let userObj: any;
    let tokenStr: string;
    try {
      const { user, token } = Database.loginUser(demoEmail, demoPassword);
      userObj = user;
      tokenStr = token;
    } catch {
      const { user, token } = Database.createUser('Alex Hunter', demoEmail, demoPassword);
      userObj = user;
      tokenStr = token;
    }
    Database.seedDemoProjectsIfEmpty(userObj.id);
    res.json({ user: userObj, token: tokenStr });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to initialize demo account.' });
  }
});

// ---------------------------------------------------------------------------
// DASHBOARD & ANALYTICS
// ---------------------------------------------------------------------------

app.get('/api/dashboard/stats', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const stats = Database.getDashboardStats(req.user.id);
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve dashboard statistics.' });
  }
});

// ---------------------------------------------------------------------------
// PROJECT MANAGEMENT & GEMINI AI ANALYSIS
// ---------------------------------------------------------------------------

app.get('/api/projects', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const projects = Database.getProjectsByUser(req.user.id);
    res.json({ projects });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to list projects.' });
  }
});

app.post('/api/projects/analyze', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { idea, domain, difficulty } = req.body;
    if (!idea || typeof idea !== 'string' || idea.trim().length < 5) {
      res.status(400).json({ error: 'Please provide a descriptive project idea (minimum 5 characters).' });
      return;
    }

    // Call Gemini AI to analyze and generate structured blueprint
    const blueprint = await GeminiService.analyzeProject(idea, domain, difficulty);

    // Save project and generate milestones in persistent DB
    const { project, milestones } = Database.createProject(req.user.id, blueprint);

    res.status(201).json({ project, milestones });
  } catch (err: any) {
    console.error('Project analysis error:', err);
    res.status(500).json({
      error: err.message || 'Failed to analyze project idea with Gemini AI. Please try again.',
    });
  }
});

app.get('/api/projects/:id', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const data = Database.getProjectById(req.params.id, req.user.id);
    if (!data) {
      res.status(404).json({ error: 'Project not found or unauthorized.' });
      return;
    }
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve project details.' });
  }
});

app.delete('/api/projects/:id', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  try {
    Database.deleteProject(req.params.id, req.user.id);
    res.json({ success: true, message: 'Project and all associated milestones deleted successfully.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to delete project.' });
  }
});

app.patch('/api/projects/:id/milestones/:milestoneId', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { isCompleted } = req.body;
    if (typeof isCompleted !== 'boolean') {
      res.status(400).json({ error: 'isCompleted boolean parameter is required.' });
      return;
    }

    const result = Database.toggleMilestone(req.params.milestoneId, req.params.id, req.user.id, isCompleted);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update milestone.' });
  }
});

// ---------------------------------------------------------------------------
// PROJECTSANALYZER AI MENTOR (CONVERSATIONAL CHATBOT)
// ---------------------------------------------------------------------------

app.post('/api/projects/:id/mentor', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { message, modelMode } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message text is required.' });
      return;
    }

    const data = Database.getProjectById(req.params.id, req.user.id);
    if (!data) {
      res.status(404).json({ error: 'Project not found or unauthorized.' });
      return;
    }

    // Persist user's message
    const userMsg = Database.addChatMessage(req.params.id, req.user.id, 'user', message.trim());

    // Generate response using Gemini AI Mentor
    const replyText = await GeminiService.mentorChat(
      data.project,
      data.milestones,
      data.chatMessages,
      message.trim(),
      modelMode || 'flash'
    );

    // Persist assistant's reply
    const assistantMsg = Database.addChatMessage(req.params.id, req.user.id, 'assistant', replyText);

    res.json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    });
  } catch (err: any) {
    console.error('Mentor chat error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate mentor reply.' });
  }
});

// ---------------------------------------------------------------------------
// DEEP THINKING REASONING ANALYSIS (gemini-3.1-pro-preview with ThinkingLevel.HIGH)
// ---------------------------------------------------------------------------

app.post('/api/projects/:id/deep-thinking', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { focusArea } = req.body;
    const data = Database.getProjectById(req.params.id, req.user.id);
    if (!data) {
      res.status(404).json({ error: 'Project not found or unauthorized.' });
      return;
    }

    const result = await GeminiService.deepThinkingAnalysis(data.project, data.milestones, focusArea);
    
    // Save note on project
    Database.updateProjectMedia(req.params.id, req.user.id, {
      deepAnalysisNotes: result.analysis,
    });

    res.json({
      analysis: result.analysis,
      thinkingProcess: result.thinkingProcess,
    });
  } catch (err: any) {
    console.error('Deep thinking analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to complete deep thinking analysis.' });
  }
});

// ---------------------------------------------------------------------------
// AI CONCEPT ART & ARCHITECTURE IMAGE GENERATION (gemini-3-pro-image-preview)
// ---------------------------------------------------------------------------

app.post('/api/projects/:id/generate-concept-image', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { imageSize = '1K', promptDescription = '' } = req.body;
    const data = Database.getProjectById(req.params.id, req.user.id);
    if (!data) {
      res.status(404).json({ error: 'Project not found or unauthorized.' });
      return;
    }

    const imageUrl = await GeminiService.generateConceptImage(
      data.project.title,
      data.project.domain,
      promptDescription || data.project.description,
      imageSize as '1K' | '2K' | '4K'
    );

    const updatedProject = Database.updateProjectMedia(req.params.id, req.user.id, {
      conceptImageUrl: imageUrl,
    });

    res.json({ imageUrl, project: updatedProject });
  } catch (err: any) {
    console.error('Image generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate concept visualization.' });
  }
});

// ---------------------------------------------------------------------------
// AI PITCH VIDEO GENERATION (veo-3.1-fast-generate-preview)
// ---------------------------------------------------------------------------

app.post('/api/projects/:id/generate-pitch-video', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { aspectRatio = '16:9' } = req.body;
    const data = Database.getProjectById(req.params.id, req.user.id);
    if (!data) {
      res.status(404).json({ error: 'Project not found or unauthorized.' });
      return;
    }

    const result = await GeminiService.generatePitchVideo(
      data.project.title,
      data.project.domain,
      aspectRatio as '16:9' | '9:16'
    );

    if (result.videoUrl) {
      Database.updateProjectMedia(req.params.id, req.user.id, {
        pitchVideoUrl: result.videoUrl,
      });
    }

    res.json(result);
  } catch (err: any) {
    console.error('Video generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to initiate video generation.' });
  }
});

// ---------------------------------------------------------------------------
// VITE DEV SERVER / STATIC ASSETS
// ---------------------------------------------------------------------------

async function startServer() {
  const http = await import('http');
  const httpServer = http.createServer(app);

  if (!isProd) {
    // Development mode with Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[ProjectsAnalyzer AI] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
