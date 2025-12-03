import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-auto">
                <div className="max-w-4xl mx-auto px-8 py-12">
                    {children}
                </div>
            </main>
        </div>
    );
};
