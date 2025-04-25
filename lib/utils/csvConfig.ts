import { CSVFieldConfig } from '../types'

// Default CSV field configurations
export const DEFAULT_CSV_FIELDS: CSVFieldConfig[] = [
  {
    id: 'date',
    name: 'Date',
    type: 'date',
    required: true,
    description: 'Transaction date',
    isDefault: true
  },
  {
    id: 'from/to',
    name: 'From/To',
    type: 'string',
    required: true,
    description: 'From/To',
    isDefault: true
  },
  {
    id: 'transaction_id',
    name: 'Transaction ID',
    type: 'string',
    required: false,
    description: 'Transaction ID',
    isDefault: false
  },
  {
    id: 'description',
    name: 'Description',
    type: 'string',
    required: true,
    description: 'Transaction description or details',
    isDefault: true
  },
  {
    id: 'amount',
    name: 'Amount',
    type: 'number',
    required: true,
    description: 'Transaction amount',
    isDefault: true
  }
]

const STORAGE_KEY = 'csv-field-config'

// Load CSV field configurations from localStorage
export function loadCSVFieldConfigs(): CSVFieldConfig[] {
  if (typeof window === 'undefined') return DEFAULT_CSV_FIELDS
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return DEFAULT_CSV_FIELDS

  try {
    const parsed = JSON.parse(stored) as CSVFieldConfig[]
    // Ensure default fields are always present
    const defaultIds = DEFAULT_CSV_FIELDS.map(field => field.id)
    const customFields = parsed.filter(field => !defaultIds.includes(field.id))
    return [...DEFAULT_CSV_FIELDS, ...customFields]
  } catch (error) {
    console.error('Error loading CSV field configs:', error)
    return DEFAULT_CSV_FIELDS
  }
}

// Save CSV field configurations to localStorage
export function saveCSVFieldConfigs(configs: CSVFieldConfig[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
}

// Generate a unique ID for new fields
export function generateFieldId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now()
} 