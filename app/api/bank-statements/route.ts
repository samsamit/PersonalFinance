import { NextResponse } from 'next/server'
import { Transaction } from '@/lib/types'

// In-memory storage for bank statements
let savedBankStatements: Transaction[] = []

export async function POST(request: Request) {
  try {
    const transactions = await request.json()
    
    if (!Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array of transactions.' },
        { status: 400 }
      )
    }

    // Save to in-memory storage
    savedBankStatements = transactions

    return NextResponse.json({ 
      message: 'Bank statements saved successfully',
      count: transactions.length 
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
  return NextResponse.json(savedBankStatements)
} 