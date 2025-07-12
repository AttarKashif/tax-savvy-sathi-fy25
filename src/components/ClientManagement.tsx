
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Eye, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  pan: string;
  aadhaar?: string;
  client_name: string;
  entity_type: string;
  email?: string;
  phone?: string;
  address?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_name?: string;
  status: string;
  created_at: string;
}

export const ClientManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', searchTerm],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`client_name.ilike.%${searchTerm}%,pan.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Client[];
    }
  });

  const addClientMutation = useMutation({
    mutationFn: async (newClient: Partial<Client>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('clients')
        .insert({ ...newClient, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Client added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add client: " + error.message,
        variant: "destructive",
      });
    }
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setSelectedClient(null);
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
    }
  });

  const handleAddClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const clientData = {
      client_name: formData.get('client_name') as string,
      pan: formData.get('pan') as string,
      aadhaar: formData.get('aadhaar') as string || undefined,
      entity_type: formData.get('entity_type') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      address: formData.get('address') as string || undefined,
      bank_account_number: formData.get('bank_account_number') as string || undefined,
      bank_ifsc: formData.get('bank_ifsc') as string || undefined,
      bank_name: formData.get('bank_name') as string || undefined,
    };

    addClientMutation.mutate(clientData);
  };

  const handleUpdateClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedClient) return;

    const formData = new FormData(event.currentTarget);
    
    const updates = {
      client_name: formData.get('client_name') as string,
      pan: formData.get('pan') as string,
      aadhaar: formData.get('aadhaar') as string || undefined,
      entity_type: formData.get('entity_type') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      address: formData.get('address') as string || undefined,
      bank_account_number: formData.get('bank_account_number') as string || undefined,
      bank_ifsc: formData.get('bank_ifsc') as string || undefined,
      bank_name: formData.get('bank_name') as string || undefined,
    };

    updateClientMutation.mutate({ id: selectedClient.id, updates });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
          <p className="text-muted-foreground">Manage your client database</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>Enter client details to add them to your database</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Name *</Label>
                  <Input id="client_name" name="client_name" required className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN *</Label>
                  <Input id="pan" name="pan" required maxLength={10} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar</Label>
                  <Input id="aadhaar" name="aadhaar" maxLength={12} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity_type">Entity Type *</Label>
                  <Select name="entity_type" required>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="HUF">HUF</SelectItem>
                      <SelectItem value="Firm">Firm</SelectItem>
                      <SelectItem value="LLP">LLP</SelectItem>
                      <SelectItem value="Company">Company</SelectItem>
                      <SelectItem value="Trust">Trust</SelectItem>
                      <SelectItem value="AOP">AOP</SelectItem>
                      <SelectItem value="BOI">BOI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" className="rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" className="rounded-lg" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Input id="bank_name" name="bank_name" className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_account_number">Account Number</Label>
                  <Input id="bank_account_number" name="bank_account_number" className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_ifsc">IFSC Code</Label>
                  <Input id="bank_ifsc" name="bank_ifsc" className="rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-lg">
                  Cancel
                </Button>
                <Button type="submit" disabled={addClientMutation.isPending} className="rounded-lg">
                  {addClientMutation.isPending ? 'Adding...' : 'Add Client'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client Database</CardTitle>
              <CardDescription>Search and manage your clients</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 rounded-lg"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading clients...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>PAN</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients?.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.client_name}</TableCell>
                    <TableCell>{client.pan}</TableCell>
                    <TableCell>{client.entity_type}</TableCell>
                    <TableCell>
                      {client.email && <div className="text-sm">{client.email}</div>}
                      {client.phone && <div className="text-sm text-muted-foreground">{client.phone}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedClient(client)}
                          className="rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update client information</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <form onSubmit={handleUpdateClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_client_name">Client Name *</Label>
                  <Input 
                    id="edit_client_name" 
                    name="client_name" 
                    defaultValue={selectedClient.client_name}
                    required 
                    className="rounded-lg" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_pan">PAN *</Label>
                  <Input 
                    id="edit_pan" 
                    name="pan" 
                    defaultValue={selectedClient.pan}
                    required 
                    maxLength={10} 
                    className="rounded-lg" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_aadhaar">Aadhaar</Label>
                  <Input 
                    id="edit_aadhaar" 
                    name="aadhaar" 
                    defaultValue={selectedClient.aadhaar || ''}
                    maxLength={12} 
                    className="rounded-lg" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_entity_type">Entity Type *</Label>
                  <Select name="entity_type" defaultValue={selectedClient.entity_type}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="HUF">HUF</SelectItem>
                      <SelectItem value="Firm">Firm</SelectItem>
                      <SelectItem value="LLP">LLP</SelectItem>
                      <SelectItem value="Company">Company</SelectItem>
                      <SelectItem value="Trust">Trust</SelectItem>
                      <SelectItem value="AOP">AOP</SelectItem>
                      <SelectItem value="BOI">BOI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_email">Email</Label>
                  <Input 
                    id="edit_email" 
                    name="email" 
                    type="email" 
                    defaultValue={selectedClient.email || ''}
                    className="rounded-lg" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_phone">Phone</Label>
                  <Input 
                    id="edit_phone" 
                    name="phone" 
                    defaultValue={selectedClient.phone || ''}
                    className="rounded-lg" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_address">Address</Label>
                <Input 
                  id="edit_address" 
                  name="address" 
                  defaultValue={selectedClient.address || ''}
                  className="rounded-lg" 
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_bank_name">Bank Name</Label>
                  <Input 
                    id="edit_bank_name" 
                    name="bank_name" 
                    defaultValue={selectedClient.bank_name || ''}
                    className="rounded-lg" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_bank_account_number">Account Number</Label>
                  <Input 
                    id="edit_bank_account_number" 
                    name="bank_account_number" 
                    defaultValue={selectedClient.bank_account_number || ''}
                    className="rounded-lg" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_bank_ifsc">IFSC Code</Label>
                  <Input 
                    id="edit_bank_ifsc" 
                    name="bank_ifsc" 
                    defaultValue={selectedClient.bank_ifsc || ''}
                    className="rounded-lg" 
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedClient(null)}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateClientMutation.isPending}
                  className="rounded-lg"
                >
                  {updateClientMutation.isPending ? 'Updating...' : 'Update Client'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
