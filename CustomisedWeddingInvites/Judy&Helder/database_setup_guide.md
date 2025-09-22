# Supabase Database Setup Guide

## Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Navigate to your project: `pxndfzixwgfawohzidju`

## Step 2: Run SQL Commands
1. In the Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the SQL commands from `supabase_setup.sql`
4. Click **Run** to execute the commands

## Step 3: Verify Table Creation
1. Go to **Table Editor**
2. You should see a new table called `messages`
3. The table should have these columns:
   - `id` (UUID, Primary Key)
   - `name` (VARCHAR)
   - `message` (TEXT)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

## Step 4: Test the Setup
1. Go to **Table Editor** → `messages`
2. Click **Insert** → **Insert row**
3. Add a test message:
   - name: "Test User"
   - message: "This is a test message"
4. Click **Save**
5. Verify the message appears in the table

## Step 5: Check Row Level Security
1. Go to **Authentication** → **Policies**
2. You should see policies for the `messages` table:
   - "Allow public insert on messages"
   - "Allow public read on messages"

## Troubleshooting
- If you get permission errors, make sure you're using the correct API key
- If the table doesn't appear, check the SQL Editor for any error messages
- If policies don't work, you may need to disable RLS temporarily for testing
