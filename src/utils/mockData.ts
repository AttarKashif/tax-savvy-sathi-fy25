// Mock data for local development without Supabase
export const mockClients = [
  {
    id: '1',
    client_name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    pan: 'ABCDE1234F',
    created_at: '2024-01-15',
    user_id: 'demo-user'
  },
  {
    id: '2',
    client_name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 9876543211',
    pan: 'FGHIJ5678K',
    created_at: '2024-01-20',
    user_id: 'demo-user'
  },
  {
    id: '3',
    client_name: 'ABC Pvt Ltd',
    email: 'info@abc.com',
    phone: '+91 9876543212',
    pan: 'KLMNO9012P',
    created_at: '2024-02-01',
    user_id: 'demo-user'
  }
];

export const mockTasks = [
  {
    id: '1',
    title: 'Complete ITR Filing for John Doe',
    description: 'Annual income tax return filing',
    status: 'Pending',
    priority: 'High',
    due_date: '2024-03-31',
    task_type: 'ITR Filing',
    created_at: '2024-01-15',
    user_id: 'demo-user',
    client_id: '1',
    clients: { client_name: 'John Doe' },
    staff: { staff_name: 'CA Admin' }
  },
  {
    id: '2',
    title: 'Audit Report for Jane Smith',
    description: 'Annual audit report preparation',
    status: 'In Progress',
    priority: 'Medium',
    due_date: '2024-04-15',
    task_type: 'Audit',
    created_at: '2024-01-20',
    user_id: 'demo-user',
    client_id: '2',
    clients: { client_name: 'Jane Smith' },
    staff: { staff_name: 'CA Admin' }
  },
  {
    id: '3',
    title: 'TDS Return Filing',
    description: 'Quarterly TDS return filing',
    status: 'Completed',
    priority: 'High',
    due_date: '2024-01-31',
    task_type: 'TDS Return',
    created_at: '2024-01-10',
    user_id: 'demo-user',
    client_id: '3',
    clients: { client_name: 'ABC Pvt Ltd' },
    staff: { staff_name: 'CA Admin' }
  }
];

export const mockComplianceCalendar = [
  {
    id: '1',
    title: 'GST Return Filing',
    description: 'Monthly GST return filing',
    due_date: '2024-12-20',
    status: 'Pending',
    priority: 'High',
    compliance_type: 'GST',
    created_at: '2024-01-15',
    user_id: 'demo-user',
    client_id: '1',
    clients: { client_name: 'John Doe' }
  },
  {
    id: '2',
    title: 'ITR Filing Deadline',
    description: 'Individual income tax return filing',
    due_date: '2024-12-25',
    status: 'Pending',
    priority: 'High',
    compliance_type: 'ITR',
    created_at: '2024-01-20',
    user_id: 'demo-user',
    client_id: '2',
    clients: { client_name: 'Jane Smith' }
  },
  {
    id: '3',
    title: 'Audit Report Submission',
    description: 'Annual audit report submission',
    due_date: '2024-12-30',
    status: 'Completed',
    priority: 'Medium',
    compliance_type: 'Audit',
    created_at: '2024-01-25',
    user_id: 'demo-user',
    client_id: '3',
    clients: { client_name: 'ABC Pvt Ltd' }
  }
];

export const mockNotices = [
  {
    id: '1',
    title: 'Income Tax Notice',
    description: 'Query regarding TDS deduction',
    status: 'Received',
    priority: 'High',
    received_date: '2024-01-15',
    response_due_date: '2024-02-15',
    created_at: '2024-01-15',
    user_id: 'demo-user',
    client_id: '1'
  },
  {
    id: '2',
    title: 'GST Notice',
    description: 'Clarification on input tax credit',
    status: 'Responded',
    priority: 'Medium',
    received_date: '2024-01-10',
    response_due_date: '2024-02-10',
    created_at: '2024-01-10',
    user_id: 'demo-user',
    client_id: '2'
  }
];

export const mockStats = {
  totalClients: mockClients.length,
  pendingTasks: mockTasks.filter(t => t.status === 'Pending').length,
  upcomingDeadlines: mockComplianceCalendar.filter(c => {
    const dueDate = new Date(c.due_date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0 && c.status === 'Pending';
  }).length,
  completedReturns: mockComplianceCalendar.filter(c => 
    c.compliance_type === 'ITR' && c.status === 'Completed'
  ).length,
  pendingNotices: mockNotices.filter(n => n.status === 'Received').length,
  overdueCompliances: mockComplianceCalendar.filter(c => {
    const dueDate = new Date(c.due_date);
    const today = new Date();
    return dueDate < today && c.status === 'Pending';
  }).length
};

// Mock query function to simulate React Query
export const createMockQuery = (data: any) => ({
  data,
  isLoading: false,
  error: null,
  refetch: () => Promise.resolve({ data })
});

// Mock user for demo mode
export const mockUser = {
  id: 'demo-user',
  email: 'demo@taxsathi.com',
  name: 'Demo User',
  role: 'admin'
};