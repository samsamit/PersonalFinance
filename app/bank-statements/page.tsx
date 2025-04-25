'use client'

import { useState, useEffect } from 'react'
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
import { CSVFieldConfig, Transaction, ColumnMapping, CSVTemplate } from '@/lib/types'
import { loadCSVFieldConfigs } from '@/lib/utils/csvConfig'
import { loadCSVTemplates } from '@/lib/utils/csvTemplates'
import { toast } from "sonner"

function parseCSVRow(row: string): string[] {
  if (!row || row.trim() === '') {
    return [];
  }

  const values: string[] = row.split(';');

  return values.map(value => {
    value = value.trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    return value;
  });
}

export default function BankStatementsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [csvContent, setCsvContent] = useState<string[][]>([])
  const [fields, setFields] = useState<CSVFieldConfig[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [templates, setTemplates] = useState<CSVTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')

  useEffect(() => {
    const configs = loadCSVFieldConfigs()
    const loadedTemplates = loadCSVTemplates()
    setFields(configs)
    setTemplates(loadedTemplates)
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const rows = text.split('\n').filter(row => row.trim() !== '')
      
      if (rows.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row')
      }

      const headerRow = rows[0]
      const parsedHeaders = parseCSVRow(headerRow)
      
      if (parsedHeaders.length < 3) {
        throw new Error('CSV file must contain at least 3 columns')
      }

      const parsedContent = rows.slice(1)
        .map(row => parseCSVRow(row))
        .filter(row => row.length === parsedHeaders.length)
      
      if (parsedContent.length === 0) {
        throw new Error('No valid data rows found in CSV file')
      }

      setHeaders(parsedHeaders)
      setCsvContent(parsedContent)
      setColumnMapping({})
      setTransactions([])

      // If a template is selected, automatically process with that template
      if (selectedTemplateId) {
        const template = templates.find(t => t.id === selectedTemplateId)
        if (template) {
          processTransactions(template.columnMappings)
        }
      }
    } catch (error) {
      console.error('Error parsing file:', error)
      toast.error(error instanceof Error ? error.message : 'Error parsing file. Please make sure it\'s a valid CSV file.')
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplateId(templateId)
      setColumnMapping(template.columnMappings)
      if (csvContent.length > 0) {
        processTransactions(template.columnMappings)
      }
    }
  }

  const processTransactions = (mapping: ColumnMapping = columnMapping) => {
    if (!csvContent.length) return

    const parsedTransactions = csvContent.map(row => {
      const transaction: Transaction = {
        date: '',
        description: '',
        amount: 0,
        type: 'debit'
      }

      // Process each field according to its configuration
      fields.forEach(field => {
        const columnIndex = headers.indexOf(mapping[field.id] || '')
        if (columnIndex === -1) return

        const value = row[columnIndex]?.trim() || ''

        switch (field.id) {
          case 'amount': {
            // Convert European number format to standard format
            const standardizedAmount = value
              .replace(/\s+/g, '')
              .replace(/\./g, '')
              .replace(',', '.')
            const amount = parseFloat(standardizedAmount)
            transaction.amount = amount
            transaction.type = amount >= 0 ? 'credit' : 'debit'
            break
          }
          case 'date':
            transaction.date = value
            break
          case 'description':
            transaction.description = value
            break
          default:
            // Handle custom fields based on their type
            if (field.type === 'number') {
              const num = parseFloat(value.replace(',', '.'))
              if (!isNaN(num)) {
                transaction[field.id] = num
              }
            } else {
              transaction[field.id] = value
            }
        }
      })

      return transaction
    }).filter(transaction => !isNaN(transaction.amount))

    setTransactions(parsedTransactions)
  }

  const handleClear = () => {
    setTransactions([])
    setHeaders([])
    setCsvContent([])
    setColumnMapping({})
    setSelectedTemplateId('')
    // Also clear the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleSave = async () => {
    if (!transactions.length) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/bank-statements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactions),
      })

      if (!response.ok) {
        throw new Error('Failed to save bank statements')
      }

      const result = await response.json()
      toast.success(`Successfully saved ${result.count} transactions`)
      handleClear() // Clear everything after successful save
    } catch (error) {
      console.error('Error saving bank statements:', error)
      toast.error('Failed to save bank statements')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bank Statements</h1>
      
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="max-w-xs"
          />
          <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleClear}>Clear</Button>
        </div>
      </div>

      {transactions.length > 0 && (
        <>
          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Transactions'}
            </Button>
          </div>
          <Table>
            <TableCaption>Your bank statement transactions</TableCaption>
            <TableHeader>
              <TableRow>
                {fields.map(field => (
                  <TableHead key={field.id} className={field.type === 'number' ? 'text-right' : ''}>
                    {field.name}
                  </TableHead>
                ))}
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  {fields.map(field => (
                    <TableCell 
                      key={field.id}
                      className={field.type === 'number' ? 'text-right' : ''}
                    >
                      {field.type === 'number' && typeof transaction[field.id] === 'number'
                        ? (transaction[field.id] as number).toFixed(2)
                        : transaction[field.id]?.toString() || ''}
                    </TableCell>
                  ))}
                  <TableCell>
                    <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {!transactions.length && !headers.length && (
        <div className="text-center text-muted-foreground">
          Upload a CSV file to get started. Select a template to automatically map the columns.
        </div>
      )}
    </div>
  )
} 