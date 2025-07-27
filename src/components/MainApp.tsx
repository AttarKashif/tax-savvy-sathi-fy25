
import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Dashboard } from './Dashboard';
import { ClientManagement } from './ClientManagement';
import { TaxCalculator } from './TaxCalculator';
import { TaxLibrary } from './TaxLibrary';
import { Settings } from './Settings';
import { ITRFiling } from './ITRFiling';
import { AuditReports } from './AuditReports';
import { TDSReturns } from './TDSReturns';
import { ReportGenerator } from './ReportGenerator';
import { AIChat } from './AIChat';

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
      case 'report-generator':
        return <ReportGenerator />;
      case 'chat':
        return <AIChat />;
      case 'library':
        return <TaxLibrary />;
      case 'settings':
        return <Settings />;
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
