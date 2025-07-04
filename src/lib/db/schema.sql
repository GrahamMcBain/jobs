-- Database schema for Farcaster Jobs Mini App
-- Use this with PostgreSQL, MySQL, or SQLite

-- Jobs table
CREATE TABLE jobs (
  id VARCHAR(255) PRIMARY KEY,
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
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  payment_tx_hash VARCHAR(255),
  payment_amount VARCHAR(50),
  payment_verified BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions table
CREATE TABLE payment_transactions (
  id VARCHAR(255) PRIMARY KEY,
  job_id VARCHAR(255) REFERENCES jobs(id),
  tx_hash VARCHAR(255) UNIQUE NOT NULL,
  from_address VARCHAR(255) NOT NULL,
  to_address VARCHAR(255) NOT NULL,
  amount VARCHAR(50) NOT NULL, -- Amount in wei
  currency VARCHAR(10) DEFAULT 'ETH',
  chain_id INTEGER NOT NULL,
  block_number INTEGER,
  verified BOOLEAN DEFAULT false,
  verification_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Job applications tracking (optional)
CREATE TABLE job_applications (
  id VARCHAR(255) PRIMARY KEY,
  job_id VARCHAR(255) REFERENCES jobs(id),
  applicant_fid INTEGER,
  applicant_username VARCHAR(255),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  application_data JSONB -- Store any additional application info
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

CREATE INDEX idx_payment_transactions_tx_hash ON payment_transactions(tx_hash);
CREATE INDEX idx_payment_transactions_job_id ON payment_transactions(job_id);
CREATE INDEX idx_payment_transactions_verified ON payment_transactions(verified);

CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_fid ON job_applications(applicant_fid);
