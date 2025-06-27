-- Portfolio Database Schema untuk MySQL
-- Jalankan file ini di MySQL Command Line atau phpMyAdmin

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Tabel profile
CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NULL,
    location VARCHAR(100) NULL,
    bio VARCHAR(1000) NULL,
    age INT NULL,
    linkedin_url VARCHAR(255) NULL,
    github_url VARCHAR(255) NULL,
    twitter_url VARCHAR(255) NULL,
    instagram_url VARCHAR(255) NULL,
    youtube_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel skills
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    proficiency INT NOT NULL,
    description VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel experiences
CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    start_date VARCHAR(20) NOT NULL,
    end_date VARCHAR(20) NULL,
    description VARCHAR(1000) NULL,
    technologies VARCHAR(1000) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel education
CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree VARCHAR(100) NOT NULL,
    institution VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    description VARCHAR(1000) NULL,
    gpa VARCHAR(10) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel certifications
CREATE TABLE IF NOT EXISTS certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    issuer VARCHAR(100) NOT NULL,
    year VARCHAR(10) NOT NULL,
    credential_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel activities
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel articles
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    excerpt VARCHAR(1000) NOT NULL,
    content VARCHAR(4000) NOT NULL,
    category VARCHAR(100) NOT NULL,
    read_time INT NOT NULL,
    image_url VARCHAR(255) NULL,
    url VARCHAR(255) NULL,
    published BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message VARCHAR(2000) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data untuk testing
-- Profile
INSERT IGNORE INTO profile (full_name, position, email, phone, location, bio, age, linkedin_url, github_url, twitter_url, instagram_url, youtube_url)
VALUES (
    'John Doe Developer',
    'Senior Full Stack Developer',
    'john.doe@example.com',
    '+62 812-3456-7890',
    'Jakarta, Indonesia',
    'I am a passionate developer with over 5 years of experience creating modern web applications. I love solving complex problems and turning creative ideas into functional, beautiful digital solutions.',
    28,
    'https://linkedin.com/in/johndoe',
    'https://github.com/johndoe',
    'https://twitter.com/johndoe',
    'https://instagram.com/johndoe',
    'https://youtube.com/@johndoe'
);

-- Skills
INSERT IGNORE INTO skills (name, category, proficiency, description) VALUES
('React.js', 'Frontend Development', 90, 'HTML5, CSS3, JavaScript, React, Vue.js'),
('Node.js', 'Backend Development', 85, 'Node.js, Python, PHP, MongoDB, MySQL'),
('Figma', 'UI/UX Design', 80, 'Figma, Adobe XD, Sketch, Photoshop'),
('AWS', 'DevOps & Cloud', 75, 'AWS, Docker, Git, CI/CD'),
('React Native', 'Mobile Development', 70, 'React Native, Flutter, iOS, Android'),
('Team Leadership', 'Soft Skills', 85, 'Leadership, Communication, Problem Solving');

-- Experiences
INSERT IGNORE INTO experiences (title, company, start_date, end_date, description, technologies) VALUES
('Senior Full Stack Developer', 'TechCorp Indonesia', '2022', NULL, 'Leading a team of 5 developers in building scalable web applications. Responsible for architecture decisions, code reviews, and mentoring junior developers.', 'React, Node.js, AWS, MongoDB'),
('Frontend Developer', 'Digital Agency XYZ', '2020', '2022', 'Developed responsive web applications for various clients. Collaborated with designers and backend developers to create seamless user experiences.', 'Vue.js, JavaScript, SASS'),
('Junior Web Developer', 'Startup InnovateID', '2019', '2020', 'Started my professional journey building web applications from scratch. Learned best practices in coding, version control, and agile development methodologies.', 'PHP, MySQL, jQuery');

-- Education
INSERT IGNORE INTO education (degree, institution, year, description, gpa) VALUES
('Computer Science', 'University of Indonesia', '2015 - 2019', 'Focused on software engineering, data structures, algorithms, and web development. Final project: E-commerce platform with AI recommendations.', '3.8/4.0');

-- Certifications
INSERT IGNORE INTO certifications (name, issuer, year, credential_url) VALUES
('AWS Certified Developer', 'Amazon Web Services', '2023', ''),
('Google Cloud Professional', 'Google Cloud', '2022', ''),
('React Advanced Patterns', 'React Training', '2022', ''),
('Scrum Master Certified', 'Scrum Alliance', '2021', '');

-- Activities
INSERT IGNORE INTO activities (title, description, icon, color) VALUES
('Tech Meetup Speaker', 'Regular speaker at local tech meetups, sharing knowledge about modern web development and best practices.', 'fas fa-users', 'blue'),
('Open Source Contributor', 'Active contributor to open source projects with over 50 contributions on GitHub and maintainer of 3 libraries.', 'fas fa-code', 'green'),
('Coding Mentor', 'Volunteer mentor for coding bootcamps, helping aspiring developers learn programming fundamentals.', 'fas fa-chalkboard-teacher', 'purple'),
('Photography', 'Passionate about landscape and street photography, which helps develop my eye for design and composition.', 'fas fa-camera', 'red'),
('Hiking & Travel', 'Love exploring nature and new places, which provides fresh perspectives and inspiration for creative work.', 'fas fa-mountain', 'yellow'),
('Tech Blogging', 'Write technical articles about web development trends, tutorials, and industry insights with 10K+ monthly readers.', 'fas fa-book', 'indigo');

-- Articles
INSERT IGNORE INTO articles (title, slug, excerpt, content, category, read_time, image_url, url, published, featured) VALUES
('The Future of Web Development: Trends to Watch in 2024', 'future-web-development-2024', 'Explore the latest trends in web development that will shape the industry in 2024 and beyond.', 'Full article content here...', 'Technology', 8, 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400', NULL, TRUE, TRUE),
('Building Scalable React Applications', 'building-scalable-react-applications', 'Learn best practices for building large-scale React applications that can grow with your business.', 'Full article content here...', 'Development', 12, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400', NULL, TRUE, FALSE);

-- Admin user
INSERT IGNORE INTO users (username, password) VALUES ('admin', 'admin123');

SELECT 'Database portfolio_db berhasil dibuat dan diisi dengan data sample!' as message; 