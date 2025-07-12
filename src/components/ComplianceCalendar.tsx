import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface Compliance {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  compliance_type: string;
  priority: string;
  status: string;
  client_id?: string;
  clients?: { client_name: string };
}

interface ComplianceInsert {
  title: string;
  compliance_type: string;
  due_date: string;
  description?: string;
  priority?: string;
  client_id?: string;
}

export const ComplianceCalendar = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: compliances, isLoading } = useQuery({
    queryKey: ['compliances', selectedFilter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('compliance_calendar')
        .select(`
          *,
          clients(client_name)
        `)
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (selectedFilter !== 'all') {
        query = query.eq('status', selectedFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Compliance[];
    }
  });

  const { data: clients } = useQuery({
    queryKey: ['clients-list'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('clients')
        .select('id, client_name')
        .eq('user_id', user.id)
        .eq('status', 'Active')
        .order('client_name');

      if (error) throw error;
      return data;
    }
  });

  const addComplianceMutation = useMutation({
    mutationFn: async (newCompliance: ComplianceInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('compliance_calendar')
        .insert({ ...newCompliance, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliances'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Compliance item added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add compliance item: " + error.message,
        variant: "destructive",
      });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('compliance_calendar')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliances'] });
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    }
  });

  const handleAddCompliance = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const complianceData: ComplianceInsert = {
      title: formData.get('title') as string,
      compliance_type: formData.get('compliance_type') as string,
      due_date: formData.get('due_date') as string,
      description: (formData.get('description') as string) || undefined,
      priority: formData.get('priority') as string,
      client_id: (formData.get('client_id') as string) || undefined,
    };

    addComplianceMutation.mutate(complianceData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'Completed') return 'default';
    if (status === 'Overdue' || new Date(dueDate) < new Date()) return 'destructive';
    return 'secondary';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days remaining`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Calendar</h1>
          <p className="text-muted-foreground">Track and manage compliance deadlines</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Compliance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-xl">
            <DialogHeader>
              <DialogTitle>Add Compliance Item</DialogTitle>
              <DialogDescription>Add a new compliance deadline to track</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCompliance} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" required className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" className="rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date *</Label>
                  <Input id="due_date" name="due_date" type="date" required className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compliance_type">Type *</Label>
                  <Select name="compliance_type" required>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ITR">ITR Filing</SelectItem>
                      <SelectItem value="TDS">TDS Return</SelectItem>
                      <SelectItem value="TCS">TCS Return</SelectItem>
                      <SelectItem value="Advance Tax">Advance Tax</SelectItem>
                      <SelectItem value="Audit">Audit</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="Medium">
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_id">Client</Label>
                  <Select name="client_id">
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.client_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-lg">
                  Cancel
                </Button>
                <Button type="submit" disabled={addComplianceMutation.isPending} className="rounded-lg">
                  {addComplianceMutation.isPending ? 'Adding...' : 'Add Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Label>Filter by status:</Label>
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-40 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">Loading compliance items...</div>
            </CardContent>
          </Card>
        ) : compliances && compliances.length > 0 ? (
          compliances.map((compliance) => (
            <Card key={compliance.id} className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(compliance.status)}
                      <h3 className="font-semibold">{compliance.title}</h3>
                      <Badge variant={compliance.priority === 'High' ? 'destructive' : 'outline'}>
                        {compliance.priority}
                      </Badge>
                    </div>
                    {compliance.description && (
                      <p className="text-sm text-muted-foreground">{compliance.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(compliance.due_date).toLocaleDateString()}
                      </span>
                      {compliance.clients && (
                        <span>Client: {compliance.clients.client_name}</span>
                      )}
                      <span>{compliance.compliance_type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {getDaysUntilDue(compliance.due_date)}
                      </p>
                      <Badge variant={getStatusColor(compliance.status, compliance.due_date)}>
                        {compliance.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      {compliance.status === 'Pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({ id: compliance.id, status: 'Completed' })}
                          disabled={updateStatusMutation.isPending}
                          className="rounded-lg"
                        >
                          Mark Complete
                        </Button>
                      )}
                      {compliance.status === 'Completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatusMutation.mutate({ id: compliance.id, status: 'Pending' })}
                          disabled={updateStatusMutation.isPending}
                          className="rounded-lg"
                        >
                          Mark Pending
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                No compliance items found. Add your first compliance deadline to get started.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
