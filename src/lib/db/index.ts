import { sql } from '@vercel/postgres';
import { Job } from '@/types';

// Database connection for Vercel Postgres
// In development, you can use a local PostgreSQL instance
// or SQLite with a different implementation

export class DatabaseService {
  
  async getAllJobs(): Promise<Job[]> {
    try {
      const { rows } = await sql`
        SELECT 
          id, title, company, company_logo_url, location, type, remote,
          salary_min, salary_max, salary_currency, description,
          requirements, benefits, tags, application_url, application_count,
          featured, posted_by_fid, posted_by_username, posted_by_display_name,
          posted_by_pfp_url, posted_at, payment_tx_hash, status
        FROM jobs 
        WHERE status = 'active' 
          AND (expires_at IS NULL OR expires_at > NOW())
        ORDER BY featured DESC, posted_at DESC
      `;
      
      return rows.map(this.mapRowToJob);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    try {
      const { rows } = await sql`
        SELECT 
          id, title, company, company_logo_url, location, type, remote,
          salary_min, salary_max, salary_currency, description,
          requirements, benefits, tags, application_url, application_count,
          featured, posted_by_fid, posted_by_username, posted_by_display_name,
          posted_by_pfp_url, posted_at, payment_tx_hash, status
        FROM jobs 
        WHERE id = ${id} AND status = 'active'
      `;
      
      return rows.length > 0 ? this.mapRowToJob(rows[0]) : null;
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw new Error('Failed to fetch job');
    }
  }

  async createJob(jobData: Omit<Job, 'id' | 'postedAt' | 'applicationCount'>): Promise<Job> {
    const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      await sql`
        INSERT INTO jobs (
          id, title, company, company_logo_url, location, type, remote,
          salary_min, salary_max, salary_currency, description,
          requirements, benefits, tags, application_url, featured,
          posted_by_fid, posted_by_username, posted_by_display_name,
          posted_by_pfp_url, payment_tx_hash, payment_amount, payment_verified
        ) VALUES (
          ${id}, ${jobData.title}, ${jobData.company}, ${jobData.companyLogoUrl || null},
          ${jobData.location}, ${jobData.type}, ${jobData.remote},
          ${jobData.salaryMin || null}, ${jobData.salaryMax || null}, ${jobData.salaryCurrency},
          ${jobData.description}, ${JSON.stringify(jobData.requirements || [])},
          ${JSON.stringify(jobData.benefits || [])}, ${JSON.stringify(jobData.tags || [])},
          ${jobData.applicationUrl || null}, ${jobData.featured},
          ${jobData.postedBy.fid}, ${jobData.postedBy.username || null},
          ${jobData.postedBy.displayName || null}, ${jobData.postedBy.pfpUrl || null},
          ${jobData.paymentTxHash || null}, ${jobData.paymentAmount || null}, 
          ${jobData.paymentVerified || false}
        )
      `;

      const newJob = await this.getJobById(id);
      if (!newJob) {
        throw new Error('Failed to create job');
      }
      
      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Failed to create job');
    }
  }

  async searchJobs(query: string, filters?: {
    type?: string;
    remote?: boolean;
    location?: string;
  }): Promise<Job[]> {
    try {
      let conditions = [`status = 'active'`, `(expires_at IS NULL OR expires_at > NOW())`];
      const values: any[] = [];
      let valueIndex = 1;

      // Text search
      if (query) {
        conditions.push(`(
          title ILIKE $${valueIndex} OR 
          company ILIKE $${valueIndex} OR 
          description ILIKE $${valueIndex} OR
          EXISTS (
            SELECT 1 FROM unnest(tags) AS tag 
            WHERE tag ILIKE $${valueIndex}
          )
        )`);
        values.push(`%${query}%`);
        valueIndex++;
      }

      // Filters
      if (filters?.type) {
        conditions.push(`type = $${valueIndex}`);
        values.push(filters.type);
        valueIndex++;
      }

      if (filters?.remote !== undefined) {
        conditions.push(`remote = $${valueIndex}`);
        values.push(filters.remote);
        valueIndex++;
      }

      if (filters?.location) {
        conditions.push(`location ILIKE $${valueIndex}`);
        values.push(`%${filters.location}%`);
        valueIndex++;
      }

      const queryText = `
        SELECT 
          id, title, company, company_logo_url, location, type, remote,
          salary_min, salary_max, salary_currency, description,
          requirements, benefits, tags, application_url, application_count,
          featured, posted_by_fid, posted_by_username, posted_by_display_name,
          posted_by_pfp_url, posted_at, payment_tx_hash, status
        FROM jobs 
        WHERE ${conditions.join(' AND ')}
        ORDER BY featured DESC, posted_at DESC
      `;

      const result = await sql.query(queryText, values);
      return result.rows.map(this.mapRowToJob);
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error('Failed to search jobs');
    }
  }

  async incrementApplicationCount(jobId: string): Promise<void> {
    try {
      await sql`
        UPDATE jobs 
        SET application_count = application_count + 1 
        WHERE id = ${jobId}
      `;
    } catch (error) {
      console.error('Error incrementing application count:', error);
      throw new Error('Failed to update application count');
    }
  }

  async verifyPayment(txHash: string, jobId: string): Promise<boolean> {
    try {
      const { rows } = await sql`
        UPDATE jobs 
        SET payment_verified = true, payment_tx_hash = ${txHash}
        WHERE id = ${jobId}
        RETURNING id
      `;
      
      return rows.length > 0;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }

  private mapRowToJob(row: any): Job {
    return {
      id: row.id,
      title: row.title,
      company: row.company,
      companyLogoUrl: row.company_logo_url,
      location: row.location,
      type: row.type,
      remote: row.remote,
      salaryMin: row.salary_min,
      salaryMax: row.salary_max,
      salaryCurrency: row.salary_currency,
      description: row.description,
      requirements: Array.isArray(row.requirements) ? row.requirements : JSON.parse(row.requirements || '[]'),
      benefits: Array.isArray(row.benefits) ? row.benefits : JSON.parse(row.benefits || '[]'),
      tags: Array.isArray(row.tags) ? row.tags : JSON.parse(row.tags || '[]'),
      applicationUrl: row.application_url,
      applicationCount: row.application_count || 0,
      featured: row.featured,
      postedBy: {
        fid: row.posted_by_fid,
        username: row.posted_by_username,
        displayName: row.posted_by_display_name,
        pfpUrl: row.posted_by_pfp_url
      },
      postedAt: row.posted_at,
      paymentTxHash: row.payment_tx_hash,
      paymentAmount: row.payment_amount,
      paymentVerified: row.payment_verified || false
    };
  }
}

// Export singleton instance
export const db = new DatabaseService();
