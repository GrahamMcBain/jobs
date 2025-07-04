import { createClient } from '@supabase/supabase-js';
import { Job } from '@/types';

// Supabase configuration with fallback for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class SupabaseService {
  
  async getAllJobs(): Promise<Job[]> {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured');
    }
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('featured', { ascending: false })
        .order('posted_at', { ascending: false });

      if (error) throw error;
      
      return data.map(this.mapRowToJob);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured');
    }
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      
      return this.mapRowToJob(data);
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw new Error('Failed to fetch job');
    }
  }

  async createJob(jobData: Omit<Job, 'id' | 'postedAt' | 'applicationCount'>): Promise<Job> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured');
    }
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          title: jobData.title,
          company: jobData.company,
          company_logo_url: jobData.companyLogoUrl,
          location: jobData.location,
          type: jobData.type,
          remote: jobData.remote,
          salary_min: jobData.salaryMin,
          salary_max: jobData.salaryMax,
          salary_currency: jobData.salaryCurrency,
          description: jobData.description,
          requirements: jobData.requirements || [],
          benefits: jobData.benefits || [],
          tags: jobData.tags || [],
          application_url: jobData.applicationUrl,
          featured: jobData.featured,
          posted_by_fid: jobData.postedBy.fid,
          posted_by_username: jobData.postedBy.username,
          posted_by_display_name: jobData.postedBy.displayName,
          posted_by_pfp_url: jobData.postedBy.pfpUrl,
          payment_tx_hash: jobData.paymentTxHash,
          payment_amount: jobData.paymentAmount,
          payment_verified: jobData.paymentVerified || false
        })
        .select()
        .single();

      if (error) throw error;
      
      return this.mapRowToJob(data);
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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured');
    }
    
    try {
      let supabaseQuery = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .or('expires_at.is.null,expires_at.gt.now()');

      // Text search using PostgreSQL full-text search
      if (query) {
        supabaseQuery = supabaseQuery.textSearch('title,company,description', query);
      }

      // Apply filters
      if (filters?.type) {
        supabaseQuery = supabaseQuery.eq('type', filters.type);
      }

      if (filters?.remote !== undefined) {
        supabaseQuery = supabaseQuery.eq('remote', filters.remote);
      }

      if (filters?.location) {
        supabaseQuery = supabaseQuery.ilike('location', `%${filters.location}%`);
      }

      const { data, error } = await supabaseQuery
        .order('featured', { ascending: false })
        .order('posted_at', { ascending: false });

      if (error) throw error;
      
      return data.map(this.mapRowToJob);
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error('Failed to search jobs');
    }
  }

  async incrementApplicationCount(jobId: string): Promise<void> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured');
    }
    
    try {
      const { error } = await supabase.rpc('increment_application_count', {
        job_id: jobId
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing application count:', error);
      // Try alternative method
      try {
        const { data: job } = await supabase
          .from('jobs')
          .select('application_count')
          .eq('id', jobId)
          .single();

        if (job) {
          await supabase
            .from('jobs')
            .update({ application_count: (job.application_count || 0) + 1 })
            .eq('id', jobId);
        }
      } catch (fallbackError) {
        console.error('Fallback increment failed:', fallbackError);
        throw new Error('Failed to update application count');
      }
    }
  }

  async verifyPayment(txHash: string, jobId: string): Promise<boolean> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured');
    }
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          payment_verified: true, 
          payment_tx_hash: txHash 
        })
        .eq('id', jobId);
      
      return !error;
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
      requirements: row.requirements || [],
      benefits: row.benefits || [],
      tags: row.tags || [],
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
export const supabaseDb = new SupabaseService();
