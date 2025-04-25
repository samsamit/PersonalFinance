import { CSVTemplate, CSVTemplateFormData } from '../types'

const STORAGE_KEY = 'csv_templates'

export function generateTemplateId(name: string): string {
  return `template_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`
}

export function loadCSVTemplates(): CSVTemplate[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error loading CSV templates:', error)
    return []
  }
}

export function saveCSVTemplates(templates: CSVTemplate[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  } catch (error) {
    console.error('Error saving CSV templates:', error)
  }
}

export function createCSVTemplate(formData: CSVTemplateFormData): CSVTemplate {
  const now = new Date().toISOString()
  return {
    id: generateTemplateId(formData.name),
    ...formData,
    createdAt: now,
    updatedAt: now
  }
}

export function updateCSVTemplate(id: string, formData: CSVTemplateFormData): CSVTemplate {
  return {
    id,
    ...formData,
    createdAt: loadCSVTemplates().find(t => t.id === id)?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export const DEFAULT_DATE_FORMATS = [
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'DD.MM.YYYY',
  'DD-MM-YYYY'
]

export const DELIMITERS = [
  { value: ',', label: 'Comma (,)' },
  { value: ';', label: 'Semicolon (;)' },
  { value: '\t', label: 'Tab' },
  { value: '|', label: 'Pipe (|)' }
] 