
-- Create clients table for comprehensive client management
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  pan VARCHAR(10) NOT NULL,
  aadhaar VARCHAR(12),
  client_name TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('Individual', 'HUF', 'Firm', 'LLP', 'Company', 'Trust', 'AOP', 'BOI')),
  email TEXT,
  phone TEXT,
  address TEXT,
  bank_account_number TEXT,
  bank_ifsc TEXT,
  bank_name TEXT,
  dsc_details JSONB,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create compliance calendar table
CREATE TABLE public.compliance_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  compliance_type TEXT NOT NULL CHECK (compliance_type IN ('ITR', 'TDS', 'TCS', 'Advance Tax', 'Audit', 'Other')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Overdue')),
  client_id UUID REFERENCES public.clients(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staff management table
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  staff_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Partner', 'Manager', 'Staff')),
  permissions JSONB DEFAULT '{}',
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table for workflow management
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  client_id UUID REFERENCES public.clients(id),
  assigned_to UUID REFERENCES public.staff(id),
  task_type TEXT NOT NULL CHECK (task_type IN ('ITR Preparation', 'TDS Return', 'TCS Return', 'Audit', 'Notice Response', 'Other')),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'On Hold')),
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notices table for tracking IT notices
CREATE TABLE public.notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  notice_type TEXT NOT NULL,
  notice_number TEXT,
  notice_date DATE,
  response_due_date DATE,
  status TEXT DEFAULT 'Received' CHECK (status IN ('Received', 'Under Review', 'Response Filed', 'Closed')),
  description TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create refund tracking table
CREATE TABLE public.refunds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  assessment_year TEXT NOT NULL,
  refund_amount DECIMAL(15,2),
  refund_date DATE,
  status TEXT DEFAULT 'Processing' CHECK (status IN ('Processing', 'Approved', 'Credited', 'Rejected')),
  acknowledgment_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create TDS challan tracking table
CREATE TABLE public.tds_challans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  client_id UUID REFERENCES public.clients(id),
  challan_number TEXT NOT NULL,
  payment_date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  tds_type TEXT NOT NULL,
  bsr_code TEXT,
  status TEXT DEFAULT 'Paid' CHECK (status IN ('Paid', 'Failed', 'Pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tds_challans ENABLE ROW LEVEL SECURITY;

-- RLS policies for clients
CREATE POLICY "Users can manage their clients" ON public.clients
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for compliance_calendar
CREATE POLICY "Users can manage their compliance calendar" ON public.compliance_calendar
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for staff
CREATE POLICY "Users can manage their staff" ON public.staff
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for tasks
CREATE POLICY "Users can manage their tasks" ON public.tasks
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for notices
CREATE POLICY "Users can manage their notices" ON public.notices
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for refunds
CREATE POLICY "Users can manage their refunds" ON public.refunds
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for tds_challans
CREATE POLICY "Users can manage their TDS challans" ON public.tds_challans
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_pan ON public.clients(pan);
CREATE INDEX idx_compliance_calendar_user_id ON public.compliance_calendar(user_id);
CREATE INDEX idx_compliance_calendar_due_date ON public.compliance_calendar(due_date);
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_notices_user_id ON public.notices(user_id);
CREATE INDEX idx_refunds_user_id ON public.refunds(user_id);
CREATE INDEX idx_tds_challans_user_id ON public.tds_challans(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_calendar_updated_at BEFORE UPDATE ON public.compliance_calendar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_refunds_updated_at BEFORE UPDATE ON public.refunds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tds_challans_updated_at BEFORE UPDATE ON public.tds_challans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
