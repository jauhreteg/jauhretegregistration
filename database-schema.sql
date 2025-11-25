-- Jauhreteg Registration Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data consistency
CREATE TYPE status_type AS ENUM (
    'new submission', 
    'in review', 
    'information requested', 
    'approved', 
    'denied', 
    'dropped'
);

CREATE TYPE division_type AS ENUM ('Junior Kaurs', 'Junior Singhs', 'Open Kaurs', 'Open Singhs');

-- Main registrations table with all form and team data
CREATE TABLE registrations (
    -- Form Data
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status status_type DEFAULT 'new submission',
    submission_date_time TIMESTAMPTZ DEFAULT NOW(),
    form_token TEXT UNIQUE,
    
    -- Team Data
    division division_type,
    team_name TEXT,
    ustad_name TEXT,
    ustad_email TEXT,
    coach_name TEXT,
    coach_email TEXT,
    team_location TEXT,
    player_order TEXT,
    team_photo TEXT, -- Will store file path/URL
    
    -- Player 1 Data
    player1_name TEXT,
    player1_singh_kaur TEXT,
    player1_dob DATE,
    player1_dob_proof TEXT, -- Will store file path/URL
    player1_email TEXT,
    player1_phone_number TEXT,
    player1_emergency_contact_name TEXT,
    player1_emergency_contact_phone TEXT,
    player1_father_name TEXT,
    player1_mother_name TEXT,
    player1_city TEXT,
    player1_gatka_experience TEXT,
    
    -- Player 2 Data
    player2_name TEXT,
    player2_singh_kaur TEXT,
    player2_dob DATE,
    player2_dob_proof TEXT, -- Will store file path/URL
    player2_email TEXT,
    player2_phone_number TEXT,
    player2_emergency_contact_name TEXT,
    player2_emergency_contact_phone TEXT,
    player2_father_name TEXT,
    player2_mother_name TEXT,
    player2_city TEXT,
    player2_gatka_experience TEXT,
    
    -- Player 3 Data
    player3_name TEXT,
    player3_singh_kaur TEXT,
    player3_dob DATE,
    player3_dob_proof TEXT, -- Will store file path/URL
    player3_email TEXT,
    player3_phone_number TEXT,
    player3_emergency_contact_name TEXT,
    player3_emergency_contact_phone TEXT,
    player3_father_name TEXT,
    player3_mother_name TEXT,
    player3_city TEXT,
    player3_gatka_experience TEXT,
    
    -- Backup Player Data
    backup_player BOOLEAN DEFAULT FALSE,
    backup_name TEXT,
    backup_singh_kaur TEXT,
    backup_dob DATE,
    backup_dob_proof TEXT, -- Will store file path/URL
    backup_email TEXT,
    backup_phone_number TEXT,
    backup_emergency_contact_name TEXT,
    backup_emergency_contact_phone TEXT,
    backup_father_name TEXT,
    backup_mother_name TEXT,
    backup_city TEXT,
    backup_gatka_experience TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints (allow null or valid email format)
    CONSTRAINT valid_ustad_email CHECK (ustad_email IS NULL OR ustad_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_coach_email CHECK (coach_email IS NULL OR coach_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_player1_email CHECK (player1_email IS NULL OR player1_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_player2_email CHECK (player2_email IS NULL OR player2_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_player3_email CHECK (player3_email IS NULL OR player3_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT backup_player_logic CHECK (
        (backup_player = FALSE) OR 
        (backup_player = TRUE AND backup_name IS NOT NULL AND backup_email IS NOT NULL)
    )
);

-- File metadata table for tracking uploaded files
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
    file_type TEXT CHECK (file_type IN ('team_photo', 'player1_dob_proof', 'player2_dob_proof', 'player3_dob_proof', 'backup_dob_proof')),
    file_path TEXT,
    file_name TEXT,
    file_size BIGINT,
    mime_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_form_token ON registrations(form_token);
CREATE INDEX idx_registrations_division ON registrations(division);
CREATE INDEX idx_registrations_team_name ON registrations(team_name);
CREATE INDEX idx_registrations_submission_date ON registrations(submission_date_time);
CREATE INDEX idx_file_uploads_registration_id ON file_uploads(registration_id);
CREATE INDEX idx_file_uploads_file_type ON file_uploads(file_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger
CREATE TRIGGER update_registrations_updated_at 
    BEFORE UPDATE ON registrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Enable but allow all for now
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow all operations for now - can be restricted later)
CREATE POLICY "Allow all operations on registrations" ON registrations FOR ALL USING (true);
CREATE POLICY "Allow all operations on file_uploads" ON file_uploads FOR ALL USING (true);

-- Create a view for easier querying with calculated fields
CREATE OR REPLACE VIEW registration_summary AS
SELECT 
    id,
    form_token,
    status,
    submission_date_time,
    division,
    team_name,
    ustad_name,
    ustad_email,
    coach_name,
    coach_email,
    team_location,
    player_order,
    backup_player,
    -- Count of uploaded files
    (SELECT COUNT(*) FROM file_uploads fu WHERE fu.registration_id = r.id AND fu.file_type = 'team_photo') as team_photos_count,
    (SELECT COUNT(*) FROM file_uploads fu WHERE fu.registration_id = r.id AND fu.file_type LIKE '%_dob_proof') as dob_proofs_count,
    created_at,
    updated_at
FROM registrations r;

-- Storage bucket creation (you'll need to create these in Supabase Dashboard > Storage)
-- Bucket name: jet-documents
-- Make it public: false (we'll handle permissions)
-- Note: Folders will be created automatically when files are uploaded
