'use client';

import { useDashboardStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { sidebarOpen } = useDashboardStore();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className={cn(
            'flex-1 overflow-hidden transition-all duration-300',
            sidebarOpen ? 'lg:ml-0' : '',
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
