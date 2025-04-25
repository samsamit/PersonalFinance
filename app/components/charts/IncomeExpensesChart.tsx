import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/lib/types';
import { useMemo } from 'react';

const COLORS = ['#00C49F', '#FF8042']; // Green for income, Orange for expenses

interface IncomeExpensesChartProps {
  transactions: Transaction[];
}

export function IncomeExpensesChart({ transactions }: IncomeExpensesChartProps) {
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    const totals = transactions.reduce((acc, t) => {
      const type = t.type === 'debit' ? 'Expenses' : 'Income';
      acc[type] = (acc[type] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>Distribution of your financial flows</CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 