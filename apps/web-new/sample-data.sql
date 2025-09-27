-- Sample data for testing the developer dashboard
-- Run this in Supabase SQL Editor after the main setup

-- Insert sample campus requests
INSERT INTO campus_requests (college_name, admin_name, admin_email, college_address, student_count, contact_number, status) VALUES
  ('Springfield University', 'Dr. Sarah Johnson', 'sarah.johnson@springfield.edu', '123 University Ave, Springfield, IL 62701', 8500, '(217) 555-0123', 'pending'),
  ('Riverside Community College', 'Prof. Michael Chen', 'mchen@riverside.edu', '456 College Blvd, Riverside, CA 92501', 3200, '(951) 555-0456', 'pending'),
  ('Tech Institute of Innovation', 'Dr. Emily Rodriguez', 'e.rodriguez@techinn.edu', '789 Innovation Dr, Austin, TX 78701', 1500, '(512) 555-0789', 'approved')
ON CONFLICT DO NOTHING;

-- Insert sample student requests
INSERT INTO student_requests (student_name, student_email, college_admin_email, status) VALUES
  ('Alex Morgan', 'alex.morgan@college.edu', 'admin@college.edu', 'pending'),
  ('Jordan Smith', 'jordan.smith@college.edu', 'admin@college.edu', 'pending'),
  ('Casey Williams', 'casey.williams@college.edu', 'admin@college.edu', 'approved')
ON CONFLICT DO NOTHING;