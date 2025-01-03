/*
  # Create reseller profiles table

  1. New Tables
    - `reseller_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `company_name` (text)
      - `contact_name` (text)
      - `phone_number` (text)
      - `address` (text)
      - `city` (text)
      - `country` (text)
      - `vat_number` (text)
      - `business_type` (text)
      - `status` (text) - pending/approved/rejected
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `reseller_profiles` table
    - Add policies for:
      - Users can read their own profile
      - Users can create their own profile
      - Users can update their own profile
*/

CREATE TABLE IF NOT EXISTS reseller_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  phone_number text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  vat_number text NOT NULL,
  business_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  CONSTRAINT status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable Row Level Security
ALTER TABLE reseller_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON reseller_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile"
  ON reseller_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON reseller_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reseller_profiles_updated_at
    BEFORE UPDATE ON reseller_profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();