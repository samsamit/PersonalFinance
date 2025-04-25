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
  const [newTemplate, setNewTemplate] = useState<CSVTemplateFormData>({
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

  const handleAddTemplate = () => {
    if (!newTemplate.name) return

    const template = createCSVTemplate(newTemplate)
    const updatedTemplates = [...templates, template]
    setTemplates(updatedTemplates)
    saveCSVTemplates(updatedTemplates)

    // Reset form
    setNewTemplate({
      name: '',
      description: '',
      delimiter: ',',
      dateFormat: 'YYYY-MM-DD',
      columnMappings: {}
    })
  }

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(template => template.id !== id)
    setTemplates(updatedTemplates)
    saveCSVTemplates(updatedTemplates)
  }

  const handleColumnMappingChange = (fieldId: string, columnName: string) => {
    setNewTemplate(prev => ({
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
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="Enter template name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Enter template description"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="delimiter">CSV Delimiter</Label>
                    <Select
                      value={newTemplate.delimiter}
                      onValueChange={(value) => setNewTemplate({ ...newTemplate, delimiter: value as ',' | ';' | '\t' | '|' })}
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
                      value={newTemplate.dateFormat}
                      onValueChange={(value) => setNewTemplate({ ...newTemplate, dateFormat: value })}
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
                delimiter={newTemplate.delimiter}
                onColumnMappingChange={handleColumnMappingChange}
                columnMappings={newTemplate.columnMappings}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleAddTemplate} disabled={!newTemplate.name} className="w-full sm:w-auto">
              Save Template
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