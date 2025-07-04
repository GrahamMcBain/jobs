import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, createJob, searchJobs } from '@/lib/storage';
import { parseStringList } from '@/lib/utils';
import { PAYMENT_CONFIG } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const remote = searchParams.get('remote');
    const location = searchParams.get('location') || '';

    const filters = {
      ...(type && { type }),
      ...(remote !== null && { remote: remote === 'true' }),
      ...(location && { location }),
    };

    const jobs = query || Object.keys(filters).length > 0 
      ? searchJobs(query, filters)
      : getAllJobs();

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'company', 'location', 'description', 'postedBy'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // TODO: Verify payment transaction
    // In a real implementation, you would:
    // 1. Verify the payment transaction hash
    // 2. Check that the payment amount is correct
    // 3. Ensure the payment hasn't been used before
    
    const jobData = {
      title: body.title,
      company: body.company,
      location: body.location,
      type: body.type || 'full-time',
      remote: Boolean(body.remote),
      salaryMin: body.salaryMin ? parseInt(body.salaryMin) : undefined,
      salaryMax: body.salaryMax ? parseInt(body.salaryMax) : undefined,
      salaryCurrency: body.salaryCurrency || 'USD',
      description: body.description,
      requirements: parseStringList(body.requirements || ''),
      benefits: parseStringList(body.benefits || ''),
      tags: parseStringList(body.tags || ''),
      postedBy: body.postedBy,
      applicationUrl: body.applicationUrl || undefined,
      featured: Boolean(body.featured),
      paymentTxHash: body.paymentTxHash,
    };

    const newJob = createJob(jobData);
    
    return NextResponse.json({ job: newJob }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
