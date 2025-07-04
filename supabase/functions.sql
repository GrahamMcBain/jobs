-- Additional SQL functions for Supabase
-- Run this in your Supabase SQL Editor after running the main schema

-- Function to increment application count
CREATE OR REPLACE FUNCTION increment_application_count(job_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE jobs 
  SET application_count = COALESCE(application_count, 0) + 1
  WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get job statistics
CREATE OR REPLACE FUNCTION get_job_stats()
RETURNS TABLE (
  total_jobs BIGINT,
  active_jobs BIGINT,
  featured_jobs BIGINT,
  total_applications BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_jobs,
    COUNT(*) FILTER (WHERE status = 'active') as active_jobs,
    COUNT(*) FILTER (WHERE featured = true AND status = 'active') as featured_jobs,
    SUM(application_count) as total_applications
  FROM jobs;
END;
$$ LANGUAGE plpgsql;

-- Function to search jobs with better text search
CREATE OR REPLACE FUNCTION search_jobs_advanced(
  search_query TEXT DEFAULT '',
  job_type TEXT DEFAULT NULL,
  is_remote BOOLEAN DEFAULT NULL,
  job_location TEXT DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  title VARCHAR(255),
  company VARCHAR(255),
  company_logo_url TEXT,
  location VARCHAR(255),
  type VARCHAR(50),
  remote BOOLEAN,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(10),
  description TEXT,
  requirements TEXT[],
  benefits TEXT[],
  tags TEXT[],
  application_url TEXT,
  application_count INTEGER,
  featured BOOLEAN,
  posted_by_fid INTEGER,
  posted_by_username VARCHAR(255),
  posted_by_display_name VARCHAR(255),
  posted_by_pfp_url TEXT,
  posted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  payment_tx_hash VARCHAR(255),
  payment_amount VARCHAR(50),
  payment_verified BOOLEAN,
  status VARCHAR(50),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  search_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.*,
    CASE 
      WHEN search_query = '' THEN 1.0
      ELSE ts_rank(
        to_tsvector('english', j.title || ' ' || j.company || ' ' || j.description || ' ' || array_to_string(j.tags, ' ')),
        plainto_tsquery('english', search_query)
      )
    END as search_rank
  FROM jobs j
  WHERE j.status = 'active'
    AND (j.expires_at IS NULL OR j.expires_at > NOW())
    AND (
      search_query = '' OR
      to_tsvector('english', j.title || ' ' || j.company || ' ' || j.description || ' ' || array_to_string(j.tags, ' '))
      @@ plainto_tsquery('english', search_query)
    )
    AND (job_type IS NULL OR j.type = job_type)
    AND (is_remote IS NULL OR j.remote = is_remote)
    AND (job_location IS NULL OR j.location ILIKE '%' || job_location || '%')
  ORDER BY j.featured DESC, search_rank DESC, j.posted_at DESC;
END;
$$ LANGUAGE plpgsql;
