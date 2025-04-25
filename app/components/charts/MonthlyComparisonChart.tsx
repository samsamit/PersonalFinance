import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/lib/types';
import { useMemo } from 'react';

interface MonthlyComparisonChartProps {
  transactions: Transaction[];
}

export function MonthlyComparisonChart({ transactions }: MonthlyComparisonChartProps) {
  const monthlyData = useMemo(() => {
    if (!transactions.length) return [];

    const monthlyTotals = transactions.reduce((acc, t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (t.type === 'credit') {
        acc[monthKey].income += t.amount;
      } else {
        acc[monthKey].expenses += Math.abs(t.amount);
      }
      
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    return Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b)) // Sort by date
      .map(([month, data]) => ({
        month,
        Income: data.income,
        Expenses: data.expenses
      }));
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income vs Expenses</CardTitle>
        <CardDescription>Compare your monthly income and expenses</CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Income" fill="#00C49F" />
            <Bar dataKey="Expenses" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 