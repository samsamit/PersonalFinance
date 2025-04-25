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
import { CSVFieldConfig } from '@/lib/types'
import { loadCSVFieldConfigs, saveCSVFieldConfigs, generateFieldId } from '@/lib/utils/csvConfig'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CSVTemplateManager } from './components/CSVTemplateManager'

export default function SettingsPage() {
  const [fields, setFields] = useState<CSVFieldConfig[]>([])
  const [newField, setNewField] = useState<Partial<CSVFieldConfig>>({
    name: '',
    type: 'string',
    required: false,
    description: ''
  })

  useEffect(() => {
    const configs = loadCSVFieldConfigs()
    setFields(configs)
  }, [])

  const handleAddField = () => {
    if (!newField.name) return

    const fieldConfig: CSVFieldConfig = {
      id: generateFieldId(newField.name),
      name: newField.name,
      type: newField.type as 'string' | 'number' | 'date',
      required: newField.required || false,
      description: newField.description || '',
      isDefault: false
    }

    const updatedFields = [...fields, fieldConfig]
    setFields(updatedFields)
    saveCSVFieldConfigs(updatedFields)

    // Reset form
    setNewField({
      name: '',
      type: 'string',
      required: false,
      description: ''
    })
  }

  const handleDeleteField = (id: string) => {
    const updatedFields = fields.filter(field => field.id !== id)
    setFields(updatedFields)
    saveCSVFieldConfigs(updatedFields)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="fields" className="space-y-6">
        <TabsList>
          <TabsTrigger value="fields">CSV Fields</TabsTrigger>
          <TabsTrigger value="templates">CSV Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="fields">
          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Field</h2>
            <div className="grid gap-4 max-w-xl">
              <div className="grid gap-2">
                <Label htmlFor="name">Field Name</Label>
                <Input
                  id="name"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  placeholder="Enter field name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Field Type</Label>
                <Select
                  value={newField.type}
                  onValueChange={(value) => setNewField({ ...newField, type: value as 'string' | 'number' | 'date' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newField.description}
                  onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                  placeholder="Enter field description"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="required">Required Field</Label>
              </div>

              <Button onClick={handleAddField} disabled={!newField.name}>
                Add Field
              </Button>
            </div>
          </div>

          <Table>
            <TableCaption>Configured CSV Fields</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>{field.type}</TableCell>
                  <TableCell>{field.description}</TableCell>
                  <TableCell>{field.required ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {!field.isDefault && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteField(field.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="templates">
          <CSVTemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  )
} 