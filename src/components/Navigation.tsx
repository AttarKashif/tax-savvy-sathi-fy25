
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Calculator,
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  FileSpreadsheet,
  Receipt,
  Shield,
  Building,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { signOut } = useAuth();

  const navigationItems = [
    { id: 'calculator', label: 'Tax Calculator', icon: Calculator },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'itr-filing', label: 'ITR Filing', icon: FileSpreadsheet },
    { id: 'audit-reports', label: 'Audit Reports', icon: Shield },
    { id: 'tds-returns', label: 'TDS Returns', icon: Receipt },
    { id: 'compliance', label: 'Compliance', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: FileText },
    { id: 'office-mgmt', label: 'Office Management', icon: Building },
    { id: 'user-mgmt', label: 'User Management', icon: UserCheck },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'library', label: 'Tax Library', icon: BookOpen },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">CA Practice Pro</h2>
        <p className="text-sm text-muted-foreground">Complete Tax Compliance Suite</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start rounded-lg"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-lg"
          onClick={() => onTabChange('settings')}
        >
          <Settings className="h-4 w-4 mr-3" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
