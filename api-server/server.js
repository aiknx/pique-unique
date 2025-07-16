require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const port = process.env.API_PORT || 3001;

// Initialize Firebase Admin
admin.initializeApp({
  projectId: 'pique-unique',
  // Use emulator in development
  ...(process.env.NODE_ENV !== 'production' && {
    auth: { host: 'localhost', port: 9099 },
    firestore: { host: 'localhost', port: 8080 }
  })
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Auth routes
app.post('/auth/session', async (req, res) => {
  try {
    const { idToken } = req.body;
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    
    res.cookie('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/auth/verify', async (req, res) => {
  try {
    const { session } = req.cookies;
    if (!session) {
      return res.status(401).json({ error: 'No session' });
    }

    const decodedClaims = await admin.auth().verifySessionCookie(session, true);
    res.json({ user: decodedClaims });
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(401).json({ error: 'Invalid session' });
  }
});

app.post('/auth/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ status: 'success' });
});

// Admin routes
app.get('/admin/test', async (req, res) => {
  try {
    const { session } = req.cookies;
    if (!session) {
      return res.status(401).json({ error: 'Nėra sesijos' });
    }

    const decodedClaims = await admin.auth().verifySessionCookie(session, true);
    const isAdmin = decodedClaims.email?.endsWith('@admin.com'); // TODO: Replace with proper admin check
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Nėra administratoriaus teisių' });
    }

    res.json({
      message: 'Admin prieiga sėkminga',
      timestamp: new Date().toISOString(),
      adminUser: {
        email: decodedClaims.email,
        uid: decodedClaims.uid,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin test error:', error);
    res.status(500).json({ error: 'Serverio klaida' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
}); 