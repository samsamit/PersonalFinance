import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/lib/types';
import { useMemo } from 'react';

interface SavingsRateChartProps {
  transactions: Transaction[];
}

export function SavingsRateChart({ transactions }: SavingsRateChartProps) {
  const savingsData = useMemo(() => {
    if (!transactions.length) return [];

    // Group transactions by month
    const monthlyData = transactions.reduce((acc, t) => {
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

    // Calculate savings rate for each month
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => {
        const savingsRate = data.income > 0 
          ? ((data.income - data.expenses) / data.income) * 100 
          : 0;
        
        return {
          month,
          savingsRate: Math.round(savingsRate * 10) / 10, // Round to 1 decimal
          savings: data.income - data.expenses
        };
      });
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Savings Rate</CardTitle>
        <CardDescription>Percentage of income saved each month</CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={savingsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Savings Rate']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="savingsRate" 
              stroke="#00C49F" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 