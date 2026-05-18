import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const SECRET_KEY = 'khibrati_super_secret_key_for_jwt_auth';
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'db.json');

// Initialize Supabase Client
const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim();
const SUPABASE_KEY = (process.env.SUPABASE_KEY || '').trim();

let supabase: any = null;
try {
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch (err) {
  console.error('⚠️ Error initializing Supabase client:', err);
}

if (supabase) {
  console.log('⚡ Connected to Supabase Database!');
} else {
  console.log('ℹ️ Running with local JSON database fallback (no Supabase keys found).');
}

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists (Self-healing for serverless hosts)
const isVercelEnvironment = process.env.VERCEL === 'true' || process.env.NOW_REGION !== undefined || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
const UPLOADS_DIR = process.env.UPLOADS_DIR || (isVercelEnvironment ? '/tmp' : path.join(__dirname, '..', 'uploads'));

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (err) {
  console.warn("⚠️ Read-only filesystem detected. Uploads will write to temporary storage /tmp.");
}

// Serve uploads as static
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Helper function to read DB
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { users: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.warn("⚠️ Database read error, falling back to empty memory state:", err);
    return { users: [] };
  }
};

// Helper function to write DB
const writeDB = (data: any) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn("⚠️ Database write error (likely read-only host), state saved in memory only:", err);
  }
};

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>مرحباً بك في الخادم الخلفي لمنصة خِبرتي (Khibrati API)</h1><p>الخادم يعمل بنجاح. الواجهة البرمجية (API) جاهزة للاستخدام.</p>');
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'Khibrati Backend is running perfectly!' });
});

// Register User
app.post('/api/auth/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;

    if (supabase) {
      // Check if user exists in Supabase
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (findError) {
        console.error('Supabase lookup error during registration:', findError);
        return res.status(500).json({ message: 'Database query error' });
      }

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user in Supabase
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        role: role || 'student'
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert([newUser]);

      if (insertError) {
        console.error('Supabase insertion error during registration:', insertError);
        return res.status(500).json({ message: 'Database insertion error' });
      }

      // Generate JWT
      const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET_KEY, { expiresIn: '1d' });

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    } else {
      // Fallback local db.json database
      const db = readDB();

      const existingUser = db.users.find((u: any) => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        role: role || 'student'
      };

      db.users.push(newUser);
      writeDB(db);

      const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET_KEY, { expiresIn: '1d' });

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login User
app.post('/api/auth/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    let user: any = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Supabase error during login:', error);
        return res.status(500).json({ message: 'Database lookup error' });
      }
      user = data;
    } else {
      const db = readDB();
      user = db.users.find((u: any) => u.email === email);
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
  let totalTrainees = 1248;

  if (supabase) {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      if (!error && count !== null) {
        totalTrainees = count;
      }
    } catch (err) {
      console.error('Failed to fetch stats count from Supabase:', err);
    }
  }

  res.json({
    total_trainees: totalTrainees,
    completed_courses: 342,
    training_hours: 8920,
    success_rate: 94
  });
});

// Recent Users
app.get('/api/dashboard/recent-users', async (req: Request, res: Response) => {
  if (supabase) {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, name, role')
        .order('id', { ascending: false }) // Fallback order
        .limit(4);

      if (!error && users) {
        const formatted = users.map((u: any) => ({
          id: u.id,
          name: u.name,
          role: u.role === 'admin' ? 'مدير النظام' : 'متدرب',
          date: 'منضم حديثاً',
          status: 'نشط'
        }));
        return res.json(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch recent users from Supabase:', err);
    }
  }

  // Fallback static users
  res.json([
    { id: 1, name: "أحمد محمود", role: "متدرب جديد", date: "منذ ساعتين", status: "نشط" },
    { id: 2, name: "سارة خالد", role: "مشرف محتوى", date: "منذ 5 ساعات", status: "نشط" },
    { id: 3, name: "محمد علي", role: "متدرب", date: "أمس", status: "غير نشط" },
    { id: 4, name: "فاطمة حسن", role: "خبير تقني", date: "أمس", status: "نشط" }
  ]);
});

// Upload Endpoint
app.post('/api/upload', upload.single('video'), (req: Request, res: Response): any => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Serve static frontend files in production
const FRONTEND_DIST = path.join(__dirname, '..', '..', 'dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get(/.*/, (req: Request, res: Response) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

// Start Server (Blocked in serverless envs to prevent execution hangs)
const isServerlessPlatform = process.env.VERCEL || process.env.NOW_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME;
if (!isServerlessPlatform) {
  app.listen(PORT, () => {
    console.log(`🚀 Khibrati Backend running on http://localhost:${PORT}`);
    console.log('Using JSON file as database (No complex DB setup required!)');
  });
}

export default app;
