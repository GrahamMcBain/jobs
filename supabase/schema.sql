-- Farcaster Jobs Mini App - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Jobs table
CREATE TABLE jobs (
  id TEXT PRIMARY KEY DEFAULT 'job_' || extract(epoch from now()) || '_' || substr(gen_random_uuid()::text, 1, 8),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  company_logo_url TEXT,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
  remote BOOLEAN NOT NULL DEFAULT false,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(10) DEFAULT 'USD',
  description TEXT NOT NULL,
  requirements TEXT[],
  benefits TEXT[],
  tags TEXT[],
  application_url TEXT,
  application_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  posted_by_fid INTEGER NOT NULL,
  posted_by_username VARCHAR(255),
  posted_by_display_name VARCHAR(255),
  posted_by_pfp_url TEXT,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  payment_tx_hash VARCHAR(255),
  payment_amount VARCHAR(50),
  payment_verified BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'removed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment transactions table
CREATE TABLE payment_transactions (
  id TEXT PRIMARY KEY DEFAULT 'tx_' || gen_random_uuid()::text,
  job_id TEXT REFERENCES jobs(id) ON DELETE CASCADE,
  tx_hash VARCHAR(255) UNIQUE NOT NULL,
  from_address VARCHAR(255) NOT NULL,
  to_address VARCHAR(255) NOT NULL,
  amount VARCHAR(50) NOT NULL, -- Amount in wei
  currency VARCHAR(10) DEFAULT 'ETH',
  chain_id INTEGER NOT NULL DEFAULT 8453, -- Base mainnet
  block_number BIGINT,
  verified BOOLEAN DEFAULT false,
  verification_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- Job applications tracking (optional)
CREATE TABLE job_applications (
  id TEXT PRIMARY KEY DEFAULT 'app_' || gen_random_uuid()::text,
  job_id TEXT REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_fid INTEGER NOT NULL,
  applicant_username VARCHAR(255),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  application_data JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX idx_jobs_featured ON jobs(featured, posted_at DESC);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_remote ON jobs(remote);
CREATE INDEX idx_jobs_posted_by_fid ON jobs(posted_by_fid);
CREATE INDEX idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || company || ' ' || description));

CREATE INDEX idx_payment_transactions_tx_hash ON payment_transactions(tx_hash);
CREATE INDEX idx_payment_transactions_job_id ON payment_transactions(job_id);
CREATE INDEX idx_payment_transactions_verified ON payment_transactions(verified);

CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_fid ON job_applications(applicant_fid);

-- RLS (Row Level Security) policies
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Allow read access to active jobs for everyone
CREATE POLICY "Allow read access to active jobs" ON jobs
  FOR SELECT USING (status = 'active');

-- Allow insert of new jobs (payment verification will be done server-side)
CREATE POLICY "Allow insert of new jobs" ON jobs
  FOR INSERT WITH CHECK (true);

-- Allow job owners to update their jobs
CREATE POLICY "Allow job owners to update" ON jobs
  FOR UPDATE USING (true); -- You can add more specific rules based on your auth

-- Allow read access to payment transactions for verification
CREATE POLICY "Allow read payment transactions" ON payment_transactions
  FOR SELECT USING (true);

-- Allow insert of payment transactions
CREATE POLICY "Allow insert payment transactions" ON payment_transactions
  FOR INSERT WITH CHECK (true);

-- Allow read access to applications
CREATE POLICY "Allow read job applications" ON job_applications
  FOR SELECT USING (true);

-- Allow insert of applications
CREATE POLICY "Allow insert job applications" ON job_applications
  FOR INSERT WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_jobs_updated_at 
  BEFORE UPDATE ON jobs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some demo data
INSERT INTO jobs (
  title, company, location, type, remote, salary_min, salary_max, 
  salary_currency, description, requirements, benefits, tags, 
  posted_by_fid, posted_by_username, posted_by_display_name, 
  application_url, featured, payment_verified
) VALUES 
(
  'Senior Frontend Developer',
  'Farcaster Protocol',
  'San Francisco, CA',
  'full-time',
  true,
  150000,
  200000,
  'USD',
  'Build the future of decentralized social media with React and TypeScript. Work on cutting-edge protocols and help shape the next generation of social networks.',
  ARRAY['5+ years of React experience', 'TypeScript proficiency', 'Web3/blockchain knowledge', 'Experience with modern frontend tooling', 'Understanding of decentralized protocols'],
  ARRAY['Competitive equity package', 'Health, dental, vision insurance', 'Remote-first culture', 'Conference and learning budget', 'Top-tier equipment'],
  ARRAY['React', 'TypeScript', 'Web3', 'Farcaster', 'Frontend'],
  3621,
  'farcaster',
  'Farcaster',
  'https://jobs.farcaster.xyz/apply/frontend',
  true,
  true
),
(
  'Smart Contract Engineer',
  'Base Protocol',
  'New York, NY',
  'full-time',
  false,
  140000,
  180000,
  'USD',
  'Design and implement secure smart contracts for our L2 scaling solution. Work with cutting-edge blockchain technology.',
  ARRAY['3+ years Solidity experience', 'Deep understanding of Ethereum', 'Security audit experience', 'Gas optimization expertise'],
  ARRAY['Token allocation', 'Relocation assistance', 'Health insurance', 'Flexible hours'],
  ARRAY['Solidity', 'Ethereum', 'L2', 'Smart Contracts', 'Base'],
  5678,
  'base',
  'Base',
  'https://base.org/careers',
  false,
  true
),
(
  'Community Manager',
  'Warpcast',
  'Remote',
  'part-time',
  true,
  50000,
  70000,
  'USD',
  'Help grow and nurture the Farcaster community. Engage with users, moderate content, and drive community initiatives.',
  ARRAY['Experience in community management', 'Deep understanding of Farcaster', 'Excellent communication skills', 'Social media expertise'],
  ARRAY['Flexible schedule', 'Remote work', 'Community perks', 'Growth opportunities'],
  ARRAY['Community', 'Social Media', 'Farcaster', 'Remote'],
  9152,
  'warpcast',
  'Warpcast',
  null,
  false,
  true
);
