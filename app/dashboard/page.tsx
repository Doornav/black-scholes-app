"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCurrentUser, logout } from '@/lib/firebase/auth';
import { getUserCalculations, getUserTokens } from '@/lib/firebase/firestore';
import type { User } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [recentCalculations, setRecentCalculations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        // Load user data
        const tokens = await getUserTokens(currentUser.uid);
        const calculations = await getUserCalculations(currentUser.uid);
        setTokenCount(tokens);
        setRecentCalculations(calculations);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (!user) {
    return null; // or a loading spinner
  }

  // Function to add new calculation
  const addCalculation = (calculation: { optionPrice: number }) => {
    setRecentCalculations(prev => [
      {
        id: prev.length + 1,
        date: new Date().toISOString().split('T')[0],
        optionPrice: calculation.optionPrice
      },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <Image src="/BS-logo.png" alt="App Logo" width={50} height={50} className="mr-2" />
            <span className="font-bold text-xl">Dashboard</span>
          </div>
          <nav className="space-x-4 flex items-center">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </nav>
          <div className="mb-8">
          <Link href="/new-calculation">
            <Button className="w-full md:w-auto">
              New Calculation
            </Button>
          </Link>
        </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar with Settings */}
          <aside className="col-span-1 bg-white shadow rounded p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <ul className="space-y-2">
              <li>
                <Button variant="link" onClick={() => { /* Navigate to profile settings */ }}>Profile</Button>
              </li>
              <li>
                <Button variant="link" onClick={() => { /* Navigate to account settings */ }}>Account</Button>
              </li>
              <li>
                <Button variant="link" onClick={() => { /* Navigate to security settings */ }}>Security</Button>
              </li>
              <li>
                <Button variant="link" onClick={() => { /* Navigate to notification settings */ }}>Notifications</Button>
              </li>
              <li>
                <Button variant="link" onClick={() => { /* Navigate to billing settings */ }}>Billing</Button>
              </li>
            </ul>
          </aside>
          {/* Main Content */}
          <section className="col-span-1 md:col-span-3 bg-white shadow rounded p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            {/* Token Balance */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Token Balance</h3>
              <p className="text-lg">{tokenCount} Tokens</p>
            </div>
            {/* Recent Calculations Table */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Recent Calculations</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculation</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentCalculations.map((calc) => (
                    <tr key={calc.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{calc.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{calc.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{calc.optionPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}