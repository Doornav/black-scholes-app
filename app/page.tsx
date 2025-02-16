"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from '@/lib/firebase/auth';

export default function Home() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      // Call the sign in function which signs in the user with Google.
      await signInWithGoogle();
      // Navigate the user to their dashboard after a successful sign in.
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <>
      {/* Static Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <Image src="/BS-logo.png" alt="App Logo" width={50} height={50} className="mr-2" />
            <span className="font-bold text-xl">Black-Scholes Calculator</span>
          </div>
          <nav className="space-x-4">
            <a href="#home" className="hover:underline">Home</a>
            <a href="#features" className="hover:underline">Features</a>
            <a href="#pricing" className="hover:underline">Pricing</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
          <Button onClick={handleSignIn}>
            Sign in with Google
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex flex-col justify-center items-center p-8 bg-gray-50">
          <div className="max-w-xl w-full text-center p-6 bg-white rounded shadow">
            <Image
              src="/BS-logo.png"
              alt="App Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold mb-4">Black-Scholes Calculator</h1>
            <p className="text-lg mb-8">
              Calculate options pricing with advanced machine learning predictions for volatility.
              Sign in with your Google account to get started.
            </p>
            <Button 
              onClick={handleSignIn}
              className="flex items-center gap-2"
            >
              <Image 
                src="/google-icon.png" 
                alt="Google" 
                width={20} 
                height={20} 
              />
              Continue with Google
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Real-time Calculations</h3>
                <p>Instant Black-Scholes calculations with customizable parameters.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">ML-Powered</h3>
                <p>Advanced machine learning predictions for volatility estimation.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">User Dashboard</h3>
                <p>Track and manage your calculations with an intuitive dashboard.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Secure Authentication</h3>
                <p>Safe and easy sign-in with Google authentication.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Pricing</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-semibold mb-2">Basic</h3>
                <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal">/month</span></p>
                <ul className="space-y-2 mb-6">
                  <li>100 Calculations</li>
                  <li>Basic Support</li>
                  <li>Standard Features</li>
                </ul>
                <Button onClick={handleSignIn} className="w-full">Get Started</Button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-2 border-blue-500">
                <h3 className="text-2xl font-semibold mb-2">Pro</h3>
                <p className="text-3xl font-bold mb-4">$19.99<span className="text-sm font-normal">/month</span></p>
                <ul className="space-y-2 mb-6">
                  <li>500 Calculations</li>
                  <li>Priority Support</li>
                  <li>Advanced Features</li>
                </ul>
                <Button onClick={handleSignIn} className="w-full">Get Started</Button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-semibold mb-2">Enterprise</h3>
                <p className="text-3xl font-bold mb-4">$49.99<span className="text-sm font-normal">/month</span></p>
                <ul className="space-y-2 mb-6">
                  <li>Unlimited Calculations</li>
                  <li>24/7 Support</li>
                  <li>All Features</li>
                </ul>
                <Button onClick={handleSignIn} className="w-full">Get Started</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Contact</h2>
            <div className="text-center space-y-2">
              <p className="text-lg">Have questions or need support?</p>
              <p>Email: support@blackscholesapp.com</p>
              <p>Phone: +1 (123) 456-7890</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 bg-gray-50 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Black-Scholes Calculator. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
