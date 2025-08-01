
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Calculator,
  LayoutDashboard, 
  Users, 
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  FileSpreadsheet,
  Receipt,
  Shield,
  FileBarChart
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
    { id: 'itr-filing', label: 'ITR Filing', icon: FileSpreadsheet },
    { id: 'tds-returns', label: 'TDS Returns', icon: Receipt },
    { id: 'report-generator', label: 'Report Generator', icon: FileBarChart },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Calculator className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Tax Sathi</h2>
            <p className="text-xs text-muted-foreground">Complete Tax Solution</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start rounded-lg h-10 px-3 transition-all duration-200 ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1 bg-muted/20">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg h-10 px-3"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
          <span className="text-sm font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};
