
import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Dashboard } from './Dashboard';
import { ClientManagement } from './ClientManagement';
import { ComplianceCalendar } from './ComplianceCalendar';
import { TaskManagement } from './TaskManagement';
import { TaxCalculator } from './TaxCalculator';
import { TaxLibrary } from './TaxLibrary';
import { Settings } from './Settings';
import { ITRFiling } from './ITRFiling';
import { AuditReports } from './AuditReports';
import { TDSReturns } from './TDSReturns';

export const MainApp = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <TaxCalculator />;
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientManagement />;
      case 'itr-filing':
        return <ITRFiling />;
      case 'audit-reports':
        return <AuditReports />;
      case 'tds-returns':
        return <TDSReturns />;
      case 'compliance':
        return <ComplianceCalendar />;
      case 'tasks':
        return <TaskManagement />;
      case 'library':
        return <TaxLibrary />;
      case 'settings':
        return <Settings />;
      case 'office-mgmt':
        return <div className="p-6"><h1 className="text-2xl font-bold">Office Management - Coming Soon</h1></div>;
      case 'user-mgmt':
        return <div className="p-6"><h1 className="text-2xl font-bold">User Management - Coming Soon</h1></div>;
      case 'chat':
        return <div className="p-6"><h1 className="text-2xl font-bold">AI Assistant - Coming Soon</h1></div>;
      default:
        return <TaxCalculator />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};
