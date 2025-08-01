
import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { TaxCalculator } from './TaxCalculator';
import { ITRFiling } from './ITRFiling';
import { TDSReturns } from './TDSReturns';
import { ReportGenerator } from './ReportGenerator';

export const MainApp = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <TaxCalculator />;
      case 'itr-filing':
        return <ITRFiling />;
      case 'tds-returns':
        return <TDSReturns />;
      case 'report-generator':
        return <ReportGenerator />;
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
