'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Transaction {
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
}

interface ColumnMapping {
  date: string
  description: string
  amount: string
}

function parseCSVRow(row: string): string[] {
  // Handle empty or undefined rows
  if (!row || row.trim() === '') {
    return [];
  }

  // Split by comma but handle quoted values
  const values: string[] = row.split(';');

  // Clean up the values by removing quotes and trimming
  return values.map(value => {
    value = value.trim();
    // Remove surrounding quotes if they exist
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    return value;
  });
}

export default function BankStatementsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState<Partial<ColumnMapping>>({})
  const [csvContent, setCsvContent] = useState<string[][]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      // Split into rows and remove empty lines
      const rows = text.split('\n').filter(row => row.trim() !== '')
      
      if (rows.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row')
      }

      // Parse headers
      const headerRow = rows[0]
      const parsedHeaders = parseCSVRow(headerRow)
      
      if (parsedHeaders.length < 3) {
        throw new Error('CSV file must contain at least 3 columns')
      }

      // Parse content rows
      const parsedContent = rows.slice(1)
        .map(row => parseCSVRow(row))
        .filter(row => row.length === parsedHeaders.length) // Only keep rows with correct number of columns
      
      if (parsedContent.length === 0) {
        throw new Error('No valid data rows found in CSV file')
      }

      setHeaders(parsedHeaders)
      setCsvContent(parsedContent)
      setColumnMapping({})
      setTransactions([])
    } catch (error) {
      console.error('Error parsing file:', error)
      alert(error instanceof Error ? error.message : 'Error parsing file. Please make sure it\'s a valid CSV file.')
    }
  }

  const handleColumnMappingChange = (field: keyof ColumnMapping, value: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const processTransactions = () => {
    const { date, description, amount } = columnMapping
    if (!date || !description || !amount || !csvContent.length) return

    const dateIndex = headers.indexOf(date)
    const descriptionIndex = headers.indexOf(description)
    const amountIndex = headers.indexOf(amount)

    if (dateIndex === -1 || descriptionIndex === -1 || amountIndex === -1) {
      alert('Invalid column mapping. Please check your column selections.')
      return
    }

    const parsedTransactions = csvContent
      .filter(row => row.length > Math.max(dateIndex, descriptionIndex, amountIndex))
      .map(row => {
        const amount = parseFloat(row[amountIndex].replace(/[^-0-9.]/g, ''))

        return {
          date: row[dateIndex],
          description: row[descriptionIndex],
          amount,
          type: amount >= 0 ? 'credit' as const : 'debit' as const
        }
      })
      .filter(transaction => !isNaN(transaction.amount))

    setTransactions(parsedTransactions)
  }

  const handleClear = () => {
    setTransactions([])
    setHeaders([])
    setCsvContent([])
    setColumnMapping({})
  }

  const isColumnMappingComplete = Boolean(
    columnMapping.date && 
    columnMapping.description && 
    columnMapping.amount
  )

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Bank Statements</h1>
      
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="max-w-xs"
          />
          <Button variant="outline" onClick={handleClear}>Clear</Button>
        </div>
        {headers.length > 0 && !isColumnMappingComplete && (
          <div className="mt-4 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Map CSV Columns</h2>
            <div className="grid gap-4 max-w-xl">
              <div className="grid grid-cols-2 gap-4 items-center">
                <label>Date Column:</label>
                <Select onValueChange={(value: string) => handleColumnMappingChange('date', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <label>Description Column:</label>
                <Select onValueChange={(value: string) => handleColumnMappingChange('description', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select description column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <label>Amount Column:</label>
                <Select onValueChange={(value: string) => handleColumnMappingChange('amount', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select amount column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="mt-2"
                onClick={processTransactions}
                disabled={!isColumnMappingComplete}
              >
                Process Transactions
              </Button>
            </div>
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <Table>
          <TableCaption>Your bank statement transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="text-right">
                  {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!transactions.length && !headers.length && (
        <div className="text-center text-muted-foreground">
          Upload a CSV file to get started. The file can have any column headers - you'll be able to map them after upload.
        </div>
      )}
    </div>
  )
} 