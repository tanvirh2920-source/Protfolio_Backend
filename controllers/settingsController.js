const { pool } = require("../database/db");
const catchAsyncError = require("../utils/catchAsyncError");

const getSettings = catchAsyncError(async (req, res) => {
  let result = await pool.query(
    "SELECT * FROM portfolio_settings WHERE id = 1",
  );
  if (result.rows.length === 0) {
    result = await pool.query(
      "INSERT INTO portfolio_settings DEFAULT VALUES RETURNING *",
    );
  }
  res.json({ success: true, data: result.rows[0] });
});

const updateSettings = catchAsyncError(async (req, res) => {
  const {
    full_name,
    title,
    bio,
    email,
    location,
    github_url,
    linkedin_url,
    facebook_url,
    resume_url,
    stat_projects,
    stat_technologies,
    stat_repos,
    stat_coffee,
    about_text,
  } = req.body;

  const result = await pool.query(
    `INSERT INTO portfolio_settings
       (id, full_name, title, bio, email, location, github_url, linkedin_url, facebook_url, resume_url,
        stat_projects, stat_technologies, stat_repos, stat_coffee, about_text, updated_at)
     VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW())
     ON CONFLICT (id) DO UPDATE SET
       full_name=EXCLUDED.full_name, title=EXCLUDED.title, bio=EXCLUDED.bio,
       email=EXCLUDED.email, location=EXCLUDED.location,
       github_url=EXCLUDED.github_url, linkedin_url=EXCLUDED.linkedin_url,
       facebook_url=EXCLUDED.facebook_url, resume_url=EXCLUDED.resume_url,
       stat_projects=EXCLUDED.stat_projects, stat_technologies=EXCLUDED.stat_technologies,
       stat_repos=EXCLUDED.stat_repos, stat_coffee=EXCLUDED.stat_coffee,
       about_text=EXCLUDED.about_text,
       updated_at=NOW()
     RETURNING *`,
    [
      full_name?.trim(),
      title?.trim(),
      bio?.trim(),
      email?.trim().toLowerCase(),
      location?.trim(),
      github_url?.trim() || null,
      linkedin_url?.trim() || null,
      facebook_url?.trim() || null,
      resume_url?.trim() || null,
      stat_projects ?? 15,
      stat_technologies ?? 20,
      stat_repos ?? 30,
      stat_coffee ?? 999,
      about_text?.trim() || null,
    ],
  );
  res.json({ success: true, data: result.rows[0] });
});

module.exports = { getSettings, updateSettings };
