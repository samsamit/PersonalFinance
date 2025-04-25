'use client';

import { useEffect, useState } from 'react';
import { Transaction } from '@/lib/types';
import { BalanceChart } from '@/app/components/charts/BalanceChart';
import { IncomeExpensesChart } from '@/app/components/charts/IncomeExpensesChart';
import { MonthlyComparisonChart } from '@/app/components/charts/MonthlyComparisonChart';
import { SpendingCategoriesChart } from '@/app/components/charts/SpendingCategoriesChart';
import { SavingsRateChart } from '@/app/components/charts/SavingsRateChart';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/bank-statements');
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <p className="text-muted-foreground">
          No transactions found. Please upload your bank statements first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Financial Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <BalanceChart transactions={transactions} />
        <IncomeExpensesChart transactions={transactions} />
        <MonthlyComparisonChart transactions={transactions} />
        <SpendingCategoriesChart transactions={transactions} />
        <div className="md:col-span-2">
          <SavingsRateChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
} 