'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your personal finance dashboard. Use the navigation menu to access different features.
      </p>
    </div>
  )
} 