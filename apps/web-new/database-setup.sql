-- SoulSync Database Setup
-- Run these queries in your Supabase SQL editor

-- 1. Create login_credentials table
CREATE TABLE IF NOT EXISTS login_credentials (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'developer', 'college_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create campus_requests table
CREATE TABLE IF NOT EXISTS campus_requests (
  id SERIAL PRIMARY KEY,
  college_name VARCHAR(255) NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  admin_name VARCHAR(255) NOT NULL,
  college_address TEXT NOT NULL,
  student_count INTEGER NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create student_requests table
CREATE TABLE IF NOT EXISTS student_requests (
  id SERIAL PRIMARY KEY,
  student_email VARCHAR(255) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  college_admin_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert initial demo data
INSERT INTO login_credentials (email, password, role) VALUES
  ('developer@soulsync.com', 'dev123', 'developer'),
  ('admin@college.edu', 'welcome@123', 'college_admin'),
  ('student@college.edu', 'welcome@123', 'student')
ON CONFLICT (email) DO NOTHING;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_login_credentials_email ON login_credentials(email);
CREATE INDEX IF NOT EXISTS idx_campus_requests_status ON campus_requests(status);
CREATE INDEX IF NOT EXISTS idx_student_requests_status ON student_requests(status);
CREATE INDEX IF NOT EXISTS idx_student_requests_admin ON student_requests(college_admin_email);

-- 6. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Add updated_at triggers
CREATE TRIGGER update_login_credentials_updated_at BEFORE UPDATE
    ON login_credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campus_requests_updated_at BEFORE UPDATE
    ON campus_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_requests_updated_at BEFORE UPDATE
    ON student_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();