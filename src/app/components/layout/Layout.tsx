"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const hideSidebar = pathname.startsWith("/survey-form/");

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const bgClass = isHydrated && hideSidebar ? "bg-blue-500" : "bg-gray-50";

  return (
    <div className={`flex h-screen ${bgClass}`}>
      {!hideSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}