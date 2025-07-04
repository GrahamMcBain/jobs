# 🗄️ Supabase Setup Guide for Farcaster Jobs Mini App

## Quick Start

### 1. **Create Database Schema**
In your Supabase dashboard → **SQL Editor**, run:

1. **Main Schema**: Copy and paste the contents of `supabase/schema.sql`
2. **Functions**: Copy and paste the contents of `supabase/functions.sql`

### 2. **Get Supabase Credentials**
From your Supabase project → **Settings** → **API**:

```bash
# Copy these values:
Project URL: https://your-project.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. **Set Environment Variables**
In your deployment (Vercel/Netlify):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. **Deploy & Test**
Your Mini App will now use Supabase for:
- ✅ Job storage and retrieval
- ✅ Payment tracking
- ✅ Application counting
- ✅ Full-text search
- ✅ Real-time capabilities (optional)

## 🚀 What You Get with Supabase

### **Production Database**
- **PostgreSQL** with full SQL support
- **Automatic backups** and point-in-time recovery
- **Connection pooling** for high performance
- **Global edge locations** for low latency

### **Built-in Features**
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** (optional for live job updates)
- **Full-text search** with PostgreSQL's powerful search capabilities
- **JSON/JSONB** support for flexible data structures

### **Developer Experience**
- **SQL Editor** with syntax highlighting
- **Database browser** for viewing data
- **API documentation** auto-generated
- **Logs and analytics** for monitoring

## 🔐 Security Configuration

The schema includes Row Level Security (RLS) policies:

```sql
-- Jobs are publicly readable when active
CREATE POLICY "Allow read access to active jobs" ON jobs
  FOR SELECT USING (status = 'active');

-- Anyone can create jobs (payment verification server-side)
CREATE POLICY "Allow insert of new jobs" ON jobs
  FOR INSERT WITH CHECK (true);
```

You can customize these policies based on your security requirements.

## 📊 Database Schema Overview

### **Jobs Table**
- Complete job information with payment tracking
- Support for arrays (requirements, benefits, tags)
- Automatic timestamps and expiration
- Full-text search optimization

### **Payment Transactions**
- Transaction verification and tracking
- Support for multiple payment methods
- Automatic verification attempts logging

### **Job Applications** (Optional)
- Track who applies to which jobs
- Store additional application metadata
- Analytics and reporting capabilities

## 🔧 Advanced Features

### **Full-Text Search**
The schema includes optimized search with PostgreSQL's `tsvector`:

```sql
-- Advanced search function
SELECT * FROM search_jobs_advanced('react developer', 'full-time', true, 'san francisco');
```

### **Real-Time Updates** (Optional)
Enable real-time job updates:

```typescript
// Listen for new jobs
supabase
  .channel('jobs')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'jobs' },
    (payload) => {
      console.log('New job posted!', payload.new);
    }
  )
  .subscribe();
```

### **Analytics Functions**
Get insights about your job board:

```sql
-- Get statistics
SELECT * FROM get_job_stats();
```

## 🚀 Migration from In-Memory Storage

Your app automatically falls back to demo data if Supabase is unavailable, making the transition seamless:

1. **Development**: Uses demo data
2. **Production**: Uses Supabase database
3. **Fallback**: Graceful degradation to demo data

## 📈 Scaling Considerations

### **Performance**
- **Indexes** are pre-configured for optimal query performance
- **Connection pooling** handles high concurrent usage
- **Edge caching** reduces latency globally

### **Storage**
- **Free tier**: 500MB database + 1GB bandwidth
- **Pro tier**: Starts at $25/month for production apps
- **Automatic scaling** based on usage

### **Backup & Recovery**
- **Daily backups** included in all plans
- **Point-in-time recovery** for Pro+ plans
- **Export capabilities** for data portability

## 🐛 Troubleshooting

### **Environment Variables**
Make sure both variables are set:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### **RLS Policies**
If queries fail, check your RLS policies in Supabase dashboard.

### **Network Issues**
Supabase requires internet access. Local development works fine.

### **Data Validation**
Check the Supabase logs for detailed error messages.

## 🎯 Next Steps

1. **Run the schema** in your Supabase SQL Editor
2. **Set environment variables** in your deployment
3. **Test job posting** with real payments
4. **Monitor performance** in Supabase dashboard
5. **Scale as needed** with Supabase Pro features

Your Farcaster Jobs Mini App is now backed by a production-grade database! 🎉
