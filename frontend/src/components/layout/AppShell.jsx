import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavBar from './BottomNavBar';

export default function AppShell() {
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background relative">
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNavBar />
    </div>
  );
}