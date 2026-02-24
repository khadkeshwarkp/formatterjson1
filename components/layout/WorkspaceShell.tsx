'use client';

import { useWorkspaceStore } from '@/lib/store';
import Sidebar from './Sidebar';
import TabBar from './TabBar';
import ToastContainer from './ToastContainer';

export default function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const isFullscreen = useWorkspaceStore((s) => s.isFullscreen);

  return (
    <div className="flex h-screen w-screen text-dt-text overflow-hidden app-shell-bg">
      {!isFullscreen && <Sidebar />}
      <div className="flex flex-col flex-1 min-w-0">
        {!isFullscreen && <TabBar />}
        <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
