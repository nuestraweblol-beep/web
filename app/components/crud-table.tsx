'use client'

import { useState, useEffect, FormEvent } from "react"
import { ArrowLeft, Plus, Eye, Pencil, Trash2, Loader, AlertTriangle, X } from "lucide-react"
import { convertToWebP, getCompressionStats, isImageFile } from '@/lib/utils/imageOptimization'
import Swal from 'sweetalert2'

interface SchemaField {
  name: string
  label: string
  type: string
}

interface CrudTableProps {
  module: {
    id: string
    title: string
    description: string
    theme: any // Using any for flexibility with the theme object we defined
  }
  onBack: () => void
  service: any  // The Firebase service (galeriaService, etc.)
  addSchema: SchemaField[]
}

export default function CrudTable({ module, onBack, service, addSchema }: CrudTableProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newRecordData, setNewRecordData] = useState<any>({})

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any | null>(null)

  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingRecord, setViewingRecord] = useState<any | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await service.getAll()
      setData(result || [])
    } catch (e: any) {
      console.error("Error al cargar los datos:", e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setNewRecordData((prev: any) => ({ ...prev, [name]: files ? files[0] : null }))
    } else {
      setNewRecordData((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Manual Validation
    const missingFields = addSchema.filter(field => {
      // Skip file validation if not usually required, but for now strict
      const val = newRecordData[field.name];
      return !val || (typeof val === 'string' && val.trim() === '');
    });

    if (missingFields.length > 0) {
      setError(`Por favor completa: ${missingFields.map(f => f.label).join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if there's an image file
      const imageField = addSchema.find(f => f.type === 'file')
      let imageFile = imageField ? newRecordData[imageField.name] : null

      // Optimize image if present
      // Optimize image if present
      if (imageFile && isImageFile(imageFile)) {
        try {
          // Silent optimization
          const optimized = await convertToWebP(imageFile, { maxWidth: 1920, maxHeight: 1920, quality: 0.85 })
          imageFile = optimized
        } catch (err) {
          console.error('Error optimizing image:', err)
          // Continue with original file if optimization fails, or throw error if critical
        }
      }

      // Show saving dialog
      Swal.fire({
        title: 'Guardando...',
        text: 'Subiendo imagen a Firebase Storage',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading() }
      })

      // Temporary userId - will be replaced with actual auth
      const userId = 'matias'

      // Call service add method
      if (module.id === 'galeria') {
        await service.add(newRecordData.titulo, imageFile, userId)
      } else {
        // For other modules (Fechas, Timeline), separate data and image
        // Create a copy of data without the file object to avoid Firestore errors
        const cleanData = { ...newRecordData };
        if (imageField) {
          delete cleanData[imageField.name];
        }

        await service.add(cleanData, imageFile)
      }

      // Close any open Sweet Alert before showing success
      Swal.close()

      await Swal.fire({
        title: '¡Guardado!',
        text: 'El registro ha sido creado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#fff',
        color: '#1f2937'
      })

      setIsAddModalOpen(false)
      setNewRecordData({})
      await fetchData()
    } catch (e: any) {
      console.error("Error al enviar datos:", e)
      Swal.close()

      await Swal.fire({
        title: 'Error al guardar',
        text: e.message || 'No se pudo guardar el registro',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (record: any) => {
    setEditingRecord(record)
    setIsEditModalOpen(true)
    setError(null)
  }

  const handleViewClick = (record: any) => {
    setViewingRecord(record)
    setIsViewModalOpen(true)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setEditingRecord((prev: any) => ({ ...prev, [name]: files ? files[0] : null }))
    } else {
      setEditingRecord((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingRecord) return
    setIsSubmitting(true)
    setError(null)
    try {
      // Check for image in edit
      const imageField = addSchema.find(f => f.type === 'file')
      let imageFile = imageField ? editingRecord[imageField.name] : null

      let newImageFile = null;
      if (imageFile && typeof imageFile !== 'string') {
        newImageFile = imageFile;
        if (isImageFile(newImageFile)) {
          try {
            newImageFile = await convertToWebP(newImageFile, { maxWidth: 1920, maxHeight: 1920, quality: 0.85 })
          } catch (e) { console.error(e) }
        }
      }

      // Clean data
      const cleanData = { ...editingRecord };
      if (imageField) {
        // If it's a File object, remove it. If it's a URL string, service might expect it or it's fine.
        // However, if we pass newImageFile, the service handles the 'foto' field.
        // If we don't pass newImageFile, we keep the 'foto' URL string.
        // But cleanData cannot contain a File object.
        if (typeof editingRecord[imageField.name] !== 'string') {
          delete cleanData[imageField.name];
        }
      }

      if (module.id === 'galeria') {
        // Galeria has specific updateTitle method, doesn't seem to support image update??
        // Checking galeriaService: updateTitle(id, title). update(id, data, file) doesn't exist?
        // Wait, galeria only updates title?
        // Let's assume generic update for others first.
        await service.updateTitle(editingRecord.id, editingRecord.titulo)
      } else {
        await service.update(editingRecord.id, cleanData, newImageFile)
      }

      Swal.fire({
        title: '¡Actualizado!',
        text: 'El registro ha sido actualizado',
        icon: 'success',
        confirmButtonText: 'Genial',
        confirmButtonColor: '#10b981'
      })

      setIsEditModalOpen(false)
      setEditingRecord(null)
      await fetchData()
    } catch (e: any) {
      console.error("Error al actualizar:", e)
      Swal.fire({
        title: 'Error',
        text: e.message || 'No se pudo actualizar el registro',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (record: any) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      iconColor: '#ef4444'
    })

    if (result.isConfirmed) {
      setError(null)
      try {
        if (module.id === 'galeria') {
          await service.delete(record.id, record.imageRef)
        } else {
          await service.delete(record.id)
        }

        Swal.fire({
          title: '¡Eliminado!',
          text: 'El registro ha sido eliminado',
          icon: 'success',
          confirmButtonColor: '#10b981',
        })

        await fetchData()
      } catch (e: any) {
        console.error("Error al eliminar:", e)
        Swal.fire({
          title: 'Error',
          text: e.message || 'No se pudo eliminar el registro',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        })
      }
    }
  }

  // Determine columns from data
  const columns = data.length > 0
    ? Object.keys(data[0]).filter((key) => !['id', 'userId', 'imageRef', 'fileSize', 'originalFileName', 'createdAt'].includes(key))
    : []

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-16 text-center">
          <Loader className="h-10 w-10 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-gray-500">Cargando contenido...</p>
        </div>
      )
    }

    if (error && !isAddModalOpen && !isEditModalOpen) {
      return (
        <div className="flex items-center justify-center p-12 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <div className="ml-4 text-left">
            <h3 className="text-lg text-red-600 font-semibold">Ocurrió un error</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="text-center p-16 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-xl text-gray-500">No hay registros para mostrar.</p>
          <p className="text-gray-400 mt-2">Puedes empezar añadiendo un nuevo registro.</p>
        </div>
      )
    }

    return (
      <div className="border border-gray-200/80 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">ID</th>
                {columns.map((column) => (
                  <th key={column} className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    {column}
                  </th>
                ))}
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-500">#{row.id?.substring(0, 8)}</td>
                  {columns.map((column) => {
                    const cellValue = row[column]
                    // Handle image fields (imageUrl or foto)
                    if ((column === 'imageUrl' || column === 'foto') && typeof cellValue === 'string') {
                      return (
                        <td key={column} className="px-6 py-4 whitespace-nowrap">
                          {cellValue ? (
                            <img src={cellValue} alt={row.titulo || 'Imagen'} className="h-10 w-14 rounded-md object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs italic">Sin imagen</span>
                          )}
                        </td>
                      )
                    }
                    return (
                      <td key={column} className="px-6 py-4 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis text-gray-700">
                        {typeof cellValue === 'string' ? cellValue : String(cellValue)}
                      </td>
                    )
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-right sticky right-0 bg-white">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleViewClick(row)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md transition-all duration-200"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(row)}
                        className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:shadow-md transition-all duration-200"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md transition-all duration-200"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderModal = (title: string, onClose: () => void, onSubmit: (e: FormEvent) => void, content: React.ReactNode, footer: React.ReactNode) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md text-gray-800">
        <form onSubmit={onSubmit}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">{content}</div>
          <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">{footer}</div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
          <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{module.title}</h1>
                <p className="text-gray-500 mt-1">{module.description}</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`px-5 py-2.5 ${module.theme.buttonGradient} text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold shadow-md`}
            >
              <Plus className="h-5 w-5" />
              Añadir Registro
            </button>
          </header>
          {renderContent()}
        </div>
      </div>

      {isAddModalOpen && renderModal(
        `Nuevo en ${module.title}`,
        () => setIsAddModalOpen(false),
        handleAddSubmit,
        <>
          {addSchema.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-600 mb-1.5">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  onChange={(e: any) => handleAddInputChange(e)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  accept={field.type === 'file' ? 'image/*' : undefined}
                  onChange={handleAddInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              )}
            </div>
          ))}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600 animate-pulse">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </>,
        <>
          <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors font-semibold text-gray-700">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className={`px-4 py-2 rounded-md ${module.theme.buttonGradient} text-white font-semibold flex items-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all`}>
            {isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      )}

      {isEditModalOpen && editingRecord && renderModal(
        `Editando #${editingRecord.id?.substring(0, 8)}`,
        () => setIsEditModalOpen(false),
        handleEditSubmit,
        <>
          {columns.map((col) => {
            const cellValue = editingRecord[col];
            // Handle image fields for edit/display
            if (col === 'imageUrl' || col === 'foto') {
              return (
                <div key={col}>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5 capitalize">{col}</label>
                  {cellValue ? (
                    <img src={cellValue} alt={editingRecord.titulo || 'Imagen'} className="h-20 w-20 rounded-md object-cover" />
                  ) : (
                    <p className="text-xs text-gray-400 italic">Sin imagen asignada</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">La imagen no se puede editar desde aquí.</p>
                </div>
              )
            }

            // Determine input type based on addSchema if available, else default to text
            const fieldSchema = addSchema.find(f => f.name === col);
            const inputType = fieldSchema ? fieldSchema.type : 'text';

            return (
              <div key={col}>
                <label htmlFor={col} className="block text-sm font-medium text-gray-600 mb-1.5 capitalize">{col}</label>
                {inputType === 'textarea' ? (
                  <textarea
                    id={col}
                    name={col}
                    rows={4}
                    value={cellValue || ''}
                    onChange={(e: any) => handleEditInputChange(e)}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  />
                ) : (
                  <input
                    type={inputType}
                    id={col}
                    name={col}
                    value={cellValue || ''}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                )}
              </div>
            )
          })}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </>,
        <>
          <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors font-semibold text-gray-700">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className={`px-4 py-2 rounded-md ${module.theme.buttonGradient} text-white font-semibold flex items-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all`}>
            {isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Actualizando...' : 'Actualizar'}
          </button>
        </>
      )}

      {isViewModalOpen && viewingRecord && renderModal(
        `Detalles de #${viewingRecord.id?.substring(0, 8)}`,
        () => setIsViewModalOpen(false),
        (e) => e.preventDefault(),
        <>
          {Object.entries(viewingRecord).map(([key, value]) => {
            if ((key === 'imageUrl' || key === 'foto') && typeof value === 'string') {
              return (
                <div key={key}>
                  <h4 className="text-sm font-medium text-gray-500 capitalize">{key}</h4>
                  <img src={value} alt={viewingRecord.titulo || 'Imagen'} className="mt-1 rounded-lg max-h-60 w-auto" />
                </div>
              )
            }
            if (['userId', 'imageRef', 'fileSize', 'originalFileName'].includes(key)) {
              return null
            }
            return (
              <div key={key}>
                <h4 className="text-sm font-medium text-gray-500 capitalize">{key}</h4>
                <p className="text-base text-gray-800">{String(value)}</p>
              </div>
            )
          })}
        </>,
        <button type="button" onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors font-semibold text-gray-700">Cerrar</button>
      )}
    </>
  )
}