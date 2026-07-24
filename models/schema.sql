-- =============================================
-- Portfolio Database Schema
-- =============================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  tech_stack  TEXT[] NOT NULL DEFAULT '{}',
  github_link VARCHAR(500),
  demo_link   VARCHAR(500),
  image_url   VARCHAR(500),
  featured    BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio settings (single row, id always = 1)
CREATE TABLE IF NOT EXISTS portfolio_settings (
  id           INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  full_name    VARCHAR(100)  NOT NULL DEFAULT 'Tanvir',
  title        VARCHAR(150)  NOT NULL DEFAULT 'Full-Stack Web Developer',
  bio          TEXT          NOT NULL DEFAULT 'I build modern, performant web applications with clean code and thoughtful design. Passionate about turning ideas into digital experiences that users love.',
  email        VARCHAR(255)  NOT NULL DEFAULT 'tanvir8817@gmail.com',
  location     VARCHAR(255)  NOT NULL DEFAULT 'Dhaka, Bangladesh',
  github_url   VARCHAR(500)           DEFAULT 'https://github.com/tanvir',
  linkedin_url VARCHAR(500)           DEFAULT 'https://linkedin.com/in/tanvir',
  facebook_url  VARCHAR(500)           DEFAULT 'https://facebook.com/username',
  resume_url   VARCHAR(500)           DEFAULT '/Tanvir_Hasan_CV.pdf',
  updated_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  -- Stats counters
  stat_projects     INTEGER DEFAULT 15,
  stat_technologies INTEGER DEFAULT 20,
  stat_repos        INTEGER DEFAULT 30,
  stat_coffee       INTEGER DEFAULT 999,
  -- About text
  about_text        TEXT DEFAULT 'Hi! I''m Tanvir Hasan, a passionate Full-Stack Web Developer based in Dhaka, Bangladesh. I love turning complex problems into simple, elegant, and intuitive digital solutions.

My journey in web development started with curiosity about how things work on the internet, and it quickly turned into a deep passion for building performant, user-friendly applications. I enjoy working across the entire stack — from crafting pixel-perfect UIs to designing robust backend architectures.

When I''m not coding, you''ll find me exploring new technologies, contributing to open-source projects, or learning something new to stay ahead in this ever-evolving field.'
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  category   VARCHAR(100) NOT NULL DEFAULT 'Other',
  sort_order INTEGER      NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id          SERIAL PRIMARY KEY,
  institution VARCHAR(200) NOT NULL,
  degree      VARCHAR(200) NOT NULL,
  period      VARCHAR(100) NOT NULL,
  status      VARCHAR(50)  DEFAULT 'Undergraduate',
  sort_order  INTEGER      DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
  id          SERIAL PRIMARY KEY,
  role        VARCHAR(200) NOT NULL,
  company     VARCHAR(200) NOT NULL,
  period      VARCHAR(100) NOT NULL,
  description TEXT[]       NOT NULL DEFAULT '{}',
  current     BOOLEAN      DEFAULT false,
  sort_order  INTEGER      DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT         NOT NULL,
  icon_name   VARCHAR(50)  NOT NULL DEFAULT 'code',
  sort_order  INTEGER      DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_sort ON skills(sort_order);
CREATE INDEX IF NOT EXISTS idx_education_sort ON education(sort_order);
CREATE INDEX IF NOT EXISTS idx_experience_sort ON experience(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);
