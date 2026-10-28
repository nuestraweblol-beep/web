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

  const fieldLabel = (key: string) =>
    addSchema.find((field) => field.name === key)?.label ?? key.replace(/_/g, ' ')

  const isImageColumn = (key: string) => key === 'imageUrl' || key === 'foto' || key === 'image'

  const formatValue = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === '') return '—'
    if (typeof value !== 'string') return String(value)
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number)
      return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }
    return value
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center gap-3 py-20 text-center">
          <Loader className="size-8 animate-spin text-accent" aria-hidden="true" />
          <p className="text-ink-muted">Cargando contenido...</p>
        </div>
      )
    }

    if (error && !isAddModalOpen && !isEditModalOpen) {
      return (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 sm:flex-row sm:items-center">
          <AlertTriangle className="size-8 shrink-0 text-red-500" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-red-700">Ocurrió un error</h3>
            <p className="text-sm text-ink-soft">{error}</p>
          </div>
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">No hay registros para mostrar.</p>
          <p className="mt-2 text-sm text-ink-muted">Puedes empezar añadiendo un nuevo registro.</p>
        </div>
      )
    }

    return (
      <>
        {/* Mobile: cards */}
        <div className="space-y-3 md:hidden">
          {data.map((row) => {
            const imageColumn = columns.find(isImageColumn)
            const imageValue = imageColumn ? row[imageColumn] : null
            const textColumns = columns.filter((column) => column !== imageColumn)

            return (
              <article key={row.id} className="rounded-2xl border border-line bg-surface p-4 shadow-soft">
                <div className="flex items-start gap-3">
                  {typeof imageValue === 'string' && imageValue && (
                    <img
                      src={imageValue}
                      alt={row.titulo || 'Imagen'}
                      className="size-16 shrink-0 rounded-xl object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg font-semibold text-ink">
                      {row.titulo || formatValue(textColumns[0], row[textColumns[0]])}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-ink-muted">#{row.id?.substring(0, 8)}</p>
                  </div>
                </div>

                <dl className="mt-3 space-y-2">
                  {textColumns.slice(0, 5).map((column) => (
                    <div key={column} className="flex gap-2 text-sm">
                      <dt className="w-24 shrink-0 capitalize text-ink-muted">{fieldLabel(column)}</dt>
                      <dd className="min-w-0 flex-1 break-words text-ink-soft">
                        {formatValue(column, row[column])}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewClick(row)}
                    aria-label="Ver detalles"
                    className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-blue-50 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <Eye className="size-4" aria-hidden="true" />
                    Ver
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditClick(row)}
                    aria-label="Editar"
                    className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-amber-50 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(row)}
                    aria-label="Eliminar"
                    className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-red-50 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Borrar
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {/* Desktop: table */}
        <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface shadow-soft md:block">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-paper">
                <tr className="border-b border-line">
                  <th scope="col" className="px-5 py-3 text-left font-medium uppercase tracking-wider text-ink-muted">ID</th>
                  {columns.map((column) => (
                    <th key={column} scope="col" className="px-5 py-3 text-left font-medium uppercase tracking-wider text-ink-muted">
                      {fieldLabel(column)}
                    </th>
                  ))}
                  <th scope="col" className="sticky right-0 bg-paper px-5 py-3 text-right font-medium uppercase tracking-wider text-ink-muted">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-paper/60">
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-ink-muted">#{row.id?.substring(0, 8)}</td>
                    {columns.map((column) => {
                      const cellValue = row[column]
                      if (isImageColumn(column) && typeof cellValue === 'string') {
                        return (
                          <td key={column} className="whitespace-nowrap px-5 py-3">
                            {cellValue ? (
                              <img src={cellValue} alt={row.titulo || 'Imagen'} className="h-10 w-14 rounded-md object-cover" loading="lazy" />
                            ) : (
                              <span className="text-xs italic text-ink-muted">Sin imagen</span>
                            )}
                          </td>
                        )
                      }
                      return (
                        <td key={column} className="max-w-xs px-5 py-3 text-ink-soft">
                          <span className="line-clamp-2">{formatValue(column, cellValue)}</span>
                        </td>
                      )
                    })}
                    <td className="sticky right-0 whitespace-nowrap bg-surface px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewClick(row)}
                          aria-label="Ver detalles"
                          title="Ver detalles"
                          className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          <Eye className="size-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditClick(row)}
                          aria-label="Editar"
                          title="Editar"
                          className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600 transition-colors hover:bg-amber-100"
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          aria-label="Eliminar"
                          title="Eliminar"
                          className="grid size-9 place-items-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )
  }

  // Modals: lock page scroll and close with Escape
  useEffect(() => {
    if (!isAddModalOpen && !isEditModalOpen && !isViewModalOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeAll = () => {
      setIsAddModalOpen(false)
      setIsEditModalOpen(false)
      setIsViewModalOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAll()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isAddModalOpen, isEditModalOpen, isViewModalOpen])

  const renderModal = (title: string, onClose: () => void, onSubmit: (e: FormEvent) => void, content: React.ReactNode, footer: React.ReactNode) => (
    <div className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center p-3 sm:items-center sm:p-4">
        <div className="my-2 w-full max-w-lg overflow-hidden rounded-2xl bg-surface text-ink shadow-2xl sm:my-8">
          <form onSubmit={onSubmit}>
            <div className="flex items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
              <h3 className="min-w-0 truncate font-display text-lg font-semibold sm:text-xl">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="grid size-10 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-paper hover:text-ink"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-[65svh] space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-5">{content}</div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-paper/60 p-4">{footer}</div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-[100svh] bg-paper pt-[var(--nav-offset)] text-ink">
        <div className="page-container pb-16">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                aria-label="Volver al panel"
                className="grid size-10 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-ink"
              >
                <ArrowLeft className="size-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <h1 className="text-balance font-display text-2xl font-bold text-ink sm:text-3xl">{module.title}</h1>
                <p className="mt-0.5 text-sm text-ink-muted">{module.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent/90"
            >
              <Plus className="size-4" aria-hidden="true" />
              Añadir registro
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
              <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-ink-soft">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  onChange={(e: any) => handleAddInputChange(e)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 transition-colors focus:border-accent focus:outline-none resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  accept={field.type === 'file' ? 'image/*' : undefined}
                  onChange={handleAddInputChange}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 transition-colors focus:border-accent focus:outline-none"
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
          <button type="button" onClick={() => setIsAddModalOpen(false)} className="min-h-11 flex-1 rounded-lg border border-line px-4 font-semibold text-ink-soft transition-colors hover:bg-paper sm:flex-none">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50 sm:flex-none">
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
                  <label className="mb-1.5 block text-sm font-medium capitalize text-ink-soft">{col}</label>
                  {cellValue ? (
                    <img src={cellValue} alt={editingRecord.titulo || 'Imagen'} className="h-20 w-20 rounded-md object-cover" />
                  ) : (
                    <p className="text-xs italic text-ink-muted">Sin imagen asignada</p>
                  )}
                  <p className="mt-2 text-xs text-ink-muted">La imagen no se puede editar desde aquí.</p>
                </div>
              )
            }

            // Determine input type based on addSchema if available, else default to text
            const fieldSchema = addSchema.find(f => f.name === col);
            const inputType = fieldSchema ? fieldSchema.type : 'text';

            return (
              <div key={col}>
                <label htmlFor={col} className="mb-1.5 block text-sm font-medium capitalize text-ink-soft">{col}</label>
                {inputType === 'textarea' ? (
                  <textarea
                    id={col}
                    name={col}
                    rows={4}
                    value={cellValue || ''}
                    onChange={(e: any) => handleEditInputChange(e)}
                    required
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 transition-colors focus:border-accent focus:outline-none resize-none"
                  />
                ) : (
                  <input
                    type={inputType}
                    id={col}
                    name={col}
                    value={cellValue || ''}
                    onChange={handleEditInputChange}
                    required
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 transition-colors focus:border-accent focus:outline-none"
                  />
                )}
              </div>
            )
          })}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </>,
        <>
          <button type="button" onClick={() => setIsEditModalOpen(false)} className="min-h-11 flex-1 rounded-lg border border-line px-4 font-semibold text-ink-soft transition-colors hover:bg-paper sm:flex-none">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50 sm:flex-none">
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
            if (isImageColumn(key) && typeof value === 'string') {
              return (
                <div key={key}>
                  <h4 className="text-sm font-medium capitalize text-ink-muted">{fieldLabel(key)}</h4>
                  {value ? (
                    <img src={value} alt={viewingRecord.titulo || 'Imagen'} className="mt-2 max-h-60 w-full rounded-lg object-contain" />
                  ) : (
                    <p className="text-sm italic text-ink-muted">Sin imagen</p>
                  )}
                </div>
              )
            }
            if (['userId', 'imageRef', 'fileSize', 'originalFileName'].includes(key)) {
              return null
            }
            return (
              <div key={key}>
                <h4 className="text-sm font-medium capitalize text-ink-muted">{fieldLabel(key)}</h4>
                <p className="mt-0.5 whitespace-pre-wrap break-words text-base text-ink">
                  {formatValue(key, value)}
                </p>
              </div>
            )
          })}
        </>,
        <button type="button" onClick={() => setIsViewModalOpen(false)} className="min-h-11 w-full rounded-lg bg-accent px-5 font-semibold text-white transition-colors hover:bg-accent/90 sm:w-auto">Cerrar</button>
      )}
    </>
  )
}