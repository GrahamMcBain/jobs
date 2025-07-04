import { Job } from '@/types';
import { supabaseDb } from './supabase';

// Database service that uses Supabase as the backend
// Falls back to Vercel Postgres if needed

export class DatabaseService {
  
  async getAllJobs(): Promise<Job[]> {
    return await supabaseDb.getAllJobs();
  }

  async getJobById(id: string): Promise<Job | null> {
    return await supabaseDb.getJobById(id);
  }

  async createJob(jobData: Omit<Job, 'id' | 'postedAt' | 'applicationCount'>): Promise<Job> {
    return await supabaseDb.createJob(jobData);
  }

  async searchJobs(query: string, filters?: {
    type?: string;
    remote?: boolean;
    location?: string;
  }): Promise<Job[]> {
    return await supabaseDb.searchJobs(query, filters);
  }

  async incrementApplicationCount(jobId: string): Promise<void> {
    return await supabaseDb.incrementApplicationCount(jobId);
  }

  async verifyPayment(txHash: string, jobId: string): Promise<boolean> {
    return await supabaseDb.verifyPayment(txHash, jobId);
  }
}

// Export singleton instance
export const db = new DatabaseService();
