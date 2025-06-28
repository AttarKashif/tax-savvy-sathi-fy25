
-- Create a profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a table to store tax calculations for authenticated users
CREATE TABLE public.tax_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  taxpayer_name TEXT,
  age INTEGER,
  income_data JSONB NOT NULL,
  deductions_data JSONB NOT NULL,
  old_regime_tax NUMERIC,
  new_regime_tax NUMERIC,
  recommended_regime TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tax_calculations table
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;

-- Create policies for tax_calculations table
CREATE POLICY "Users can view their own calculations"
  ON public.tax_calculations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculations"
  ON public.tax_calculations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calculations"
  ON public.tax_calculations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculations"
  ON public.tax_calculations
  FOR DELETE
  USING (auth.uid() = user_id);
