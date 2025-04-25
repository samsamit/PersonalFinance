'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CSVFieldConfig } from '@/lib/types'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const NONE_VALUE = '__none__'

interface CSVPreviewMappingProps {
  fields: CSVFieldConfig[]
  delimiter: string
  onColumnMappingChange: (fieldId: string, columnName: string) => void
  columnMappings: { [key: string]: string }
}

export function CSVPreviewMapping({
  fields,
  delimiter,
  onColumnMappingChange,
  columnMappings
}: CSVPreviewMappingProps) {
  const [headers, setHeaders] = useState<string[]>([])
  const [previewData, setPreviewData] = useState<string[][]>([])
  const [error, setError] = useState<string>('')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const lines = text.split('\n')
      if (lines.length < 2) {
        setError('File must contain at least headers and one row of data')
        return
      }

      // Parse headers and first few rows
      const csvHeaders = lines[0].split(delimiter).map(h => h.trim().replace(/["']/g, ''))
      const sampleData = lines
        .slice(1, 6) // Get up to 5 rows for preview
        .map(line => line.split(delimiter).map(cell => cell.trim().replace(/["']/g, '')))
        .filter(row => row.length === csvHeaders.length) // Only keep valid rows

      setHeaders(csvHeaders)
      setPreviewData(sampleData)
      setError('')
    } catch (err) {
      setError('Error reading file. Please make sure it\'s a valid CSV file.')
      console.error('Error reading CSV file:', err)
    }
  }

  const handleMappingChange = (fieldId: string, value: string) => {
    onColumnMappingChange(fieldId, value === NONE_VALUE ? '' : value)
  }

  const getMappingValue = (fieldId: string): string => {
    const value = columnMappings[fieldId]
    return value || NONE_VALUE
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="max-w-sm"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {headers.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                <span className="text-sm font-medium">{field.name}</span>
                <Select
                  value={getMappingValue(field.id)}
                  onValueChange={(value) => handleMappingChange(field.id, value)}
                >
                  <SelectTrigger className='min-w-[200px]'>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE}>None</SelectItem>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>CSV Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea  className="h-fit">
                <ScrollBar orientation='horizontal' />
                <div className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead key={index} className="min-w-[150px]">{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 