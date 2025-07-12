
import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Dashboard } from './Dashboard';
import { ClientManagement } from './ClientManagement';
import { ComplianceCalendar } from './ComplianceCalendar';
import { TaskManagement } from './TaskManagement';
import { TaxCalculator } from './TaxCalculator';
import { TaxLibrary } from './TaxLibrary';

export const MainApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientManagement />;
      case 'compliance':
        return <ComplianceCalendar />;
      case 'tasks':
        return <TaskManagement />;
      case 'calculator':
        return <TaxCalculator />;
      case 'library':
        return <TaxLibrary />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
