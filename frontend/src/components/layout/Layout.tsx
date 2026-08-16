import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AddWebsiteModal } from '../website/AddWebsiteModal';

interface LayoutProps {
  onExportReport?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ onExportReport }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0d14]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} onExportReport={onExportReport} />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet context={{ openAddModal: () => setIsAddModalOpen(true) }} />
        </main>
      </div>

      {/* Global Add Website Modal */}
      <AddWebsiteModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
