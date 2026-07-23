require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = require('./app');
const { createTables } = require('./models/createTables');

const PORT = process.env.PORT || 5000;

// Initialize database schema and start server
async function startServer() {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

if (process.env.VERCEL !== '1') {
  startServer();
}

module.exports = app;
