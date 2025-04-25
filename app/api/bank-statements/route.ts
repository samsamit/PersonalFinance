import { NextResponse } from 'next/server'
import { Transaction, CSVTemplate } from '@/lib/types'

// In-memory storage for bank statements and templates
let savedBankStatements: Transaction[] = []
let savedTemplates: CSVTemplate[] = []

// Future database integration point
interface DatabaseService {
  saveTransactions(transactions: Transaction[]): Promise<number>
  getTransactions(): Promise<Transaction[]>
  saveTemplate(template: CSVTemplate): Promise<CSVTemplate>
  getTemplates(): Promise<CSVTemplate[]>
  deleteTemplate(id: string): Promise<void>
}

// In-memory implementation
const inMemoryDb: DatabaseService = {
  async saveTransactions(transactions: Transaction[]) {
    savedBankStatements = transactions
    return transactions.length
  },
  async getTransactions() {
    return savedBankStatements
  },
  async saveTemplate(template: CSVTemplate) {
    const existingIndex = savedTemplates.findIndex(t => t.id === template.id)
    if (existingIndex >= 0) {
      savedTemplates[existingIndex] = template
    } else {
      savedTemplates.push(template)
    }
    return template
  },
  async getTemplates() {
    return savedTemplates
  },
  async deleteTemplate(id: string) {
    savedTemplates = savedTemplates.filter(t => t.id !== id)
  }
}

// Use this to switch between in-memory and future database implementation
const db: DatabaseService = inMemoryDb

export async function POST(request: Request) {
  try {
    const transactions = await request.json()
    
    if (!Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array of transactions.' },
        { status: 400 }
      )
    }

    const count = await db.saveTransactions(transactions)

    return NextResponse.json({ 
      message: 'Bank statements saved successfully',
      count
    })
  } catch (error) {
    console.error('Error saving bank statements:', error)
    return NextResponse.json(
      { error: 'Failed to save bank statements' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const transactions = await db.getTransactions()
  return NextResponse.json(transactions)
}

// Template endpoints
export async function PUT(request: Request) {
  try {
    const template = await request.json()
    
    if (!template.id || !template.name) {
      return NextResponse.json(
        { error: 'Invalid template data. ID and name are required.' },
        { status: 400 }
      )
    }

    const savedTemplate = await db.saveTemplate(template)
    return NextResponse.json(savedTemplate)
  } catch (error) {
    console.error('Error saving template:', error)
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    await db.deleteTemplate(id)
    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
} 