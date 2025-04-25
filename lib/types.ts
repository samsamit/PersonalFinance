export interface CSVFieldConfig {
  id: string
  name: string
  type: 'string' | 'number' | 'date'
  required: boolean
  description: string
  isDefault: boolean
}

export interface Transaction {
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  [key: string]: string | number // Allow dynamic fields
}

export interface ColumnMapping {
  [key: string]: string // Map field names to CSV column headers
} 