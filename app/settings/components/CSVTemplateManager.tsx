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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CSVTemplate, CSVTemplateFormData, CSVFieldConfig } from '@/lib/types'
import { 
  loadCSVTemplates, 
  saveCSVTemplates, 
  createCSVTemplate,
  updateCSVTemplate,
  DEFAULT_DATE_FORMATS,
  DELIMITERS
} from '@/lib/utils/csvTemplates'
import { loadCSVFieldConfigs } from '@/lib/utils/csvConfig'
import { CSVPreviewMapping } from './CSVPreviewMapping'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CSVTemplateManager() {
  const [templates, setTemplates] = useState<CSVTemplate[]>([])
  const [fields, setFields] = useState<CSVFieldConfig[]>([])
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)
  const [formData, setFormData] = useState<CSVTemplateFormData>({
    name: '',
    description: '',
    delimiter: ',',
    dateFormat: 'YYYY-MM-DD',
    columnMappings: {}
  })

  useEffect(() => {
    const loadedTemplates = loadCSVTemplates()
    const loadedFields = loadCSVFieldConfigs()
    setTemplates(loadedTemplates)
    setFields(loadedFields)
  }, [])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      delimiter: ',',
      dateFormat: 'YYYY-MM-DD',
      columnMappings: {}
    })
    setEditingTemplate(null)
  }

  const handleSaveTemplate = () => {
    if (!formData.name) return

    let updatedTemplates: CSVTemplate[]
    
    if (editingTemplate) {
      const template = updateCSVTemplate(editingTemplate, formData)
      updatedTemplates = templates.map(t => 
        t.id === editingTemplate ? template : t
      )
    } else {
      const template = createCSVTemplate(formData)
      updatedTemplates = [...templates, template]
    }

    setTemplates(updatedTemplates)
    saveCSVTemplates(updatedTemplates)
    resetForm()
  }

  const handleEditTemplate = (template: CSVTemplate) => {
    setEditingTemplate(template.id)
    setFormData({
      name: template.name,
      description: template.description,
      delimiter: template.delimiter,
      dateFormat: template.dateFormat,
      columnMappings: template.columnMappings
    })
  }

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(template => template.id !== id)
    setTemplates(updatedTemplates)
    saveCSVTemplates(updatedTemplates)
    if (editingTemplate === id) {
      resetForm()
    }
  }

  const handleColumnMappingChange = (fieldId: string, columnName: string) => {
    setFormData(prev => ({
      ...prev,
      columnMappings: {
        ...prev.columnMappings,
        [fieldId]: columnName
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter template name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter template description"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="delimiter">CSV Delimiter</Label>
                    <Select
                      value={formData.delimiter}
                      onValueChange={(value) => setFormData({ ...formData, delimiter: value as ',' | ';' | '\t' | '|' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delimiter" />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIMITERS.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={formData.dateFormat}
                      onValueChange={(value) => setFormData({ ...formData, dateFormat: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEFAULT_DATE_FORMATS.map((format) => (
                          <SelectItem key={format} value={format}>{format}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Column Mappings</CardTitle>
            </CardHeader>
            <CardContent>
              <CSVPreviewMapping
                fields={fields}
                delimiter={formData.delimiter}
                onColumnMappingChange={handleColumnMappingChange}
                columnMappings={formData.columnMappings}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            {editingTemplate && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleSaveTemplate} 
              disabled={!formData.name}
              className="w-full sm:w-auto"
            >
              {editingTemplate ? 'Update Template' : 'Save Template'}
            </Button>
          </div>
        </div>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Saved Templates</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <Table>
                  <TableCaption>List of saved CSV templates</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden sm:table-cell">Delimiter</TableHead>
                      <TableHead className="hidden sm:table-cell">Date Format</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{template.description}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {DELIMITERS.find(d => d.value === template.delimiter)?.label}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{template.dateFormat}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTemplate(template)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 