'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  const incrementCounter = async () => {
    try {
      const response = await fetch('/api/counter', {
        method: 'POST',
      });
      const data = await response.json();
      setCount(data.count);
    } catch (error) {
      console.error('Error incrementing counter:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-primary">Personal Finance</h1>
        <p className="mt-4 text-lg text-muted-foreground">Track and manage your personal finances</p>
        <button
          onClick={incrementCounter}
          className="mt-8 px-4 py-2 bg- text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Count: {count}
        </button>
      </div>
    </main>
  );
} 