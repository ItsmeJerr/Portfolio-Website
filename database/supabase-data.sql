-- Supabase insert script for your portfolio data.
-- Replace placeholder values with your actual CV information.

-- 1) Profile
INSERT INTO profile (
  full_name,
  position,
  email,
  phone,
  location,
  bio,
  age,
  linkedin_url,
  github_url,
  twitter_url,
  instagram_url,
  youtube_url,
  image
) VALUES (
  'M. Bintang Alffajry',
  'Software Engineer',
  'mbintangal05@gmail.com',
  '+62 895-1884-7188',
  'Kota Bekasi, Indonesia',
  'A passionate software engineer with a strong focus on web development, building user-friendly applications with React, TypeScript, and Supabase. I enjoy solving problems through clean code, collaborating in agile teams, and continuously learning new technologies to deliver high-quality digital experiences.',
  0,
  'https://www.linkedin.com/in/m-bintang-alffajry',
  'https://github.com/ItsmeJerr',
  '',
  'https://instagram.com/mbalffa.jry',
  'https://www.youtube.com/channel/mbalffajry',
  ''
);

-- 2) Skills
INSERT INTO skills (name, category, proficiency, description) VALUES
  ('JavaScript', 'Frontend', 90, 'Experience building dynamic web applications with React.'),
  ('TypeScript', 'Frontend', 85, 'Strong typed JavaScript for safer code and better tooling.'),
  ('React', 'Frontend', 88, 'Built responsive UI components and reusable design systems.'),
  ('Node.js', 'Backend', 80, 'Developed REST APIs and server-side logic using Node.js.'),
  ('SQL / PostgreSQL', 'Database', 78, 'Created database schemas and optimized queries.');

-- 3) Experiences
INSERT INTO experiences (title, company, start_date, end_date, description, technologies, images) VALUES
  ('Campus Lost Tracker - Mobile Lost & Found Application', 'Software Engineering Project', '2026-01', NULL, 'Developed a mobile-based lost and found application using Flutter and REST API architecture. Implemented reporting, smart matching, real-time notifications, chat, and item verification features. Designed relational database structure and backend integration using MySQL and PHP.', 'Flutter, PHP, REST API, MySQL', '[]'),
  ('Isle Tours - Tourism Information Website', 'Web Information System Project', '2025-03', '2025-06', 'Developed a tourism information website focused on destinations in the Riau Islands region. Designed user-friendly interfaces and organized tourism content for better accessibility.', 'HTML, CSS, JavaScript', '[]');

-- 4) Education
INSERT INTO education (degree, institution, year, description, gpa, image) VALUES
  ('Bachelor of Informatics', 'Universitas Maritim Raja Ali Haji', '2023 - now', 'Focused on web development, algorithms, and user interface design.', '3.75', 'https://your-education-image.jpg');


-- 6) Activities
INSERT INTO activities (title, description, icon, color, image) VALUES
  ('Open Source Contributor', 'Contributed to web development projects and libraries on GitHub.', 'fas fa-code-branch', 'blue', 'https://your-activity-image.jpg'),
  ('Tech Blogging', 'Published articles about JavaScript, React, and frontend best practices.', 'fas fa-pen', 'green', 'https://your-blog-image.jpg');

-- 7) Articles (optional)
INSERT INTO articles (title, slug, excerpt, content, category, read_time, image_url, url, published, featured) VALUES
  ('How to build a modern portfolio website', 'build-modern-portfolio', 'A practical guide to building a portfolio website with React and Supabase.', 'Full article content goes here...', 'Web Development', 5, 'https://your-article-image.jpg', 'https://your-article-url.com', true, false);

-- Optional: add an admin user record if you want it in the database
INSERT INTO users (username, password) VALUES ('bintang', 'bintang123');
