
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalClients: number;
  pendingTasks: number;
  upcomingDeadlines: number;
  completedReturns: number;
  pendingNotices: number;
  overdueCompliances: number;
}

export const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [clients, tasks, compliances, notices] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('tasks').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'Pending'),
        supabase.from('compliance_calendar').select('*').eq('user_id', user.id),
        supabase.from('notices').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'Received')
      ]);

      const today = new Date();
      const upcomingDeadlines = compliances.data?.filter(c => {
        const dueDate = new Date(c.due_date);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0 && c.status === 'Pending';
      }).length || 0;

      const overdueCompliances = compliances.data?.filter(c => {
        const dueDate = new Date(c.due_date);
        return dueDate < today && c.status === 'Pending';
      }).length || 0;

      const completedReturns = compliances.data?.filter(c => 
        c.compliance_type === 'ITR' && c.status === 'Completed'
      ).length || 0;

      return {
        totalClients: clients.count || 0,
        pendingTasks: tasks.count || 0,
        upcomingDeadlines,
        completedReturns,
        pendingNotices: notices.count || 0,
        overdueCompliances
      };
    }
  });

  const { data: recentTasks } = useQuery({
    queryKey: ['recent-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data } = await supabase
        .from('tasks')
        .select(`
          *,
          clients!inner(client_name),
          staff(staff_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      return data;
    }
  });

  const { data: upcomingCompliances } = useQuery({
    queryKey: ['upcoming-compliances'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const { data } = await supabase
        .from('compliance_calendar')
        .select(`
          *,
          clients(client_name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'Pending')
        .gte('due_date', today.toISOString().split('T')[0])
        .lte('due_date', nextWeek.toISOString().split('T')[0])
        .order('due_date', { ascending: true });

      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome to your CA Practice Management System
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
            <p className="text-xs text-muted-foreground">Active client base</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingTasks || 0}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.upcomingDeadlines || 0}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Returns</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.completedReturns || 0}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Notices</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.pendingNotices || 0}</div>
            <p className="text-xs text-muted-foreground">Need response</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.overdueCompliances || 0}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Latest task assignments and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks?.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.clients?.client_name} • {task.task_type}
                    </p>
                  </div>
                  <Badge 
                    variant={task.status === 'Completed' ? 'default' : 
                             task.status === 'In Progress' ? 'secondary' : 'outline'}
                  >
                    {task.status}
                  </Badge>
                </div>
              ))}
              {(!recentTasks || recentTasks.length === 0) && (
                <p className="text-sm text-muted-foreground">No recent tasks</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Compliance deadlines in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingCompliances?.map((compliance) => (
                <div key={compliance.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{compliance.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {compliance.clients?.client_name} • {compliance.compliance_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">
                      {new Date(compliance.due_date).toLocaleDateString()}
                    </p>
                    <Badge variant={compliance.priority === 'High' ? 'destructive' : 'outline'}>
                      {compliance.priority}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!upcomingCompliances || upcomingCompliances.length === 0) && (
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
