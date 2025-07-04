import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Job } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || undefined;
    const remote = searchParams.get('remote');
    const location = searchParams.get('location') || undefined;

    const filters = {
      type,
      remote: remote === 'true' ? true : remote === 'false' ? false : undefined,
      location,
    };

    let jobs: Job[];
    if (query || Object.values(filters).some(Boolean)) {
      jobs = await db.searchJobs(query, filters);
    } else {
      jobs = await db.getAllJobs();
    }

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
    const {
      title,
      company,
      companyLogoUrl,
      location,
      type,
      remote,
      salaryMin,
      salaryMax,
      salaryCurrency,
      description,
      requirements,
      benefits,
      tags,
      applicationUrl,
      featured,
      postedBy,
      paymentTxHash,
      paymentAmount,
      paymentToken,
    } = body;

    // Validate required fields
    if (!title || !company || !location || !type || !description || !postedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payment for job posting
    if (!paymentTxHash) {
      return NextResponse.json(
        { error: 'Payment required to post job' },
        { status: 400 }
      );
    }

    const jobData = {
      title,
      company,
      companyLogoUrl,
      location,
      type,
      remote: remote === true,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
      salaryCurrency: salaryCurrency || 'USD',
      description,
      requirements: requirements ? requirements.split('\n').filter(Boolean) : [],
      benefits: benefits ? benefits.split('\n').filter(Boolean) : [],
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
      applicationUrl,
      featured: featured === true,
      postedBy,
      paymentTxHash,
      paymentAmount,
      paymentToken,
      paymentVerified: false, // Will be verified separately
    };

    const job = await db.createJob(jobData);

    // TODO: Trigger payment verification in background
    // You might want to add this to a queue for processing

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
