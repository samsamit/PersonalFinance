import { NextResponse } from 'next/server'
import { CSVTemplate } from '@/lib/types'
import { loadCSVTemplates, saveCSVTemplates, createCSVTemplate } from '@/lib/utils/csvTemplates'

export async function GET() {
  const templates = loadCSVTemplates()
  return NextResponse.json(templates)
}

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    
    if (!formData.name) {
      return NextResponse.json(
        { error: 'Template name is required.' },
        { status: 400 }
      )
    }

    const template = createCSVTemplate(formData)
    const templates = loadCSVTemplates()
    templates.push(template)
    saveCSVTemplates(templates)

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const template = await request.json()
    
    if (!template.id || !template.name) {
      return NextResponse.json(
        { error: 'Invalid template data. ID and name are required.' },
        { status: 400 }
      )
    }

    const templates = loadCSVTemplates()
    const index = templates.findIndex(t => t.id === template.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Template not found.' },
        { status: 404 }
      )
    }

    templates[index] = {
      ...template,
      updatedAt: new Date().toISOString()
    }
    
    saveCSVTemplates(templates)
    return NextResponse.json(templates[index])
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
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

    const templates = loadCSVTemplates()
    const filteredTemplates = templates.filter(t => t.id !== id)
    
    if (filteredTemplates.length === templates.length) {
      return NextResponse.json(
        { error: 'Template not found.' },
        { status: 404 }
      )
    }

    saveCSVTemplates(filteredTemplates)
    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
} 