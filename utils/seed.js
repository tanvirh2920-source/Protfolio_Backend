require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const { pool } = require('../database/db');
const { createTables } = require('../models/createTables');

async function seed() {
  console.log('🌱 Seeding database...');

  // Ensure tables exist first
  await createTables();

  // Default admin (email: admin@portfolio.com / password: Admin123!)
  const hash = await bcrypt.hash('Admin123!', 10);
  await pool.query(`
    INSERT INTO admins (email, password)
    VALUES ($1, $2)
    ON CONFLICT (email) DO NOTHING
  `, ['admin@portfolio.com', hash]);
  console.log('✅ Admin user ready  →  admin@portfolio.com / Admin123!');

  // Sample projects
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce application with user authentication, product catalog, shopping cart, and Stripe payment processing.',
      tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
      github_link: 'https://github.com/tanvir/ecommerce',
      demo_link: 'https://ecommerce-demo.com',
      featured: true,
    },
    {
      title: 'Task Management App',
      description: 'A Kanban-style task management application with drag-and-drop functionality and real-time updates via WebSockets.',
      tech_stack: ['React', 'Express.js', 'PostgreSQL', 'Socket.io', 'Redux'],
      github_link: 'https://github.com/tanvir/taskmanager',
      demo_link: 'https://tasks-demo.com',
      featured: true,
    },
    {
      title: 'Weather Dashboard',
      description: 'Real-time weather data visualization with interactive charts and 7-day forecasts.',
      tech_stack: ['React', 'Chart.js', 'OpenWeather API', 'Tailwind CSS'],
      github_link: 'https://github.com/tanvir/weather',
      demo_link: 'https://weather-demo.com',
      featured: false,
    },
  ];

  for (const p of projects) {
    await pool.query(`
      INSERT INTO projects (title, description, tech_stack, github_link, demo_link, featured)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `, [p.title, p.description, p.tech_stack, p.github_link, p.demo_link, p.featured]);
  }
  console.log('✅ Sample projects inserted.');

  await pool.end();
  console.log('🎉 Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
