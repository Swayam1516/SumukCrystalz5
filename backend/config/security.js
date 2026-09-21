/**
 * Security & CORS configuration
 */

const allowedOrigins = [
  'https://sumukcrystalz.vercel.app',
  'https://admin.sumukcrystalz.com',
];

if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.ADMIN_URL && !allowedOrigins.includes(process.env.ADMIN_URL)) {
  allowedOrigins.push(process.env.ADMIN_URL);
}

const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      (!isProduction && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) ||
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation: Origin "${origin}" is not allowed.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature'],
};

module.exports = {
  corsOptions,
  allowedOrigins,
};

