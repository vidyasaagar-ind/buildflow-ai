import { useMemo, useState } from 'react'
import Button from '../ui/Button'

const CATEGORY_OPTIONS = [
  'Student Academic Project',
  'Small Business Website',
  'Portfolio Website',
  'Web Application',
  'Other',
]

const initialValues = {
  title: '',
  category: '',
  idea: '',
  targetUser: '',
  deadline: '',
}

function validate(values) {
  const errors = {}

  if (!values.title.trim()) errors.title = 'Project title is required.'
  if (!values.category) errors.category = 'Category is required.'
  if (!values.idea.trim()) errors.idea = 'Detailed idea is required.'
  if (!values.targetUser.trim()) errors.targetUser = 'Target user is required.'

  return errors
}

function ProjectForm({ onSubmit, onCancel, submitLabel = 'Create Project' }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const isValid = useMemo(() => Object.keys(validate(values)).length === 0, [values])

  const handleChange = (field) => (event) => {
    const nextValues = { ...values, [field]: event.target.value }
    setValues(nextValues)

    if (errors[field]) {
      const nextErrors = validate(nextValues)
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(values)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit(values)
    setValues(initialValues)
    setErrors({})
  }

  const fieldBaseClass =
    'w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none ring-brand-500 transition focus:ring-2 dark:bg-slate-900'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Project Title *</label>
        <input
          value={values.title}
          onChange={handleChange('title')}
          placeholder="Example: Smart Attendance System"
          className={`${fieldBaseClass} ${errors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Category *</label>
        <select
          value={values.category}
          onChange={handleChange('category')}
          className={`${fieldBaseClass} ${errors.category ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
        >
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Detailed Idea *</label>
        <textarea
          value={values.idea}
          onChange={handleChange('idea')}
          placeholder="Describe your project idea, goals, and expected outcomes."
          rows={4}
          className={`${fieldBaseClass} ${errors.idea ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
        />
        {errors.idea && <p className="mt-1 text-xs text-red-600">{errors.idea}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Target User *</label>
        <input
          value={values.targetUser}
          onChange={handleChange('targetUser')}
          placeholder="Example: College faculty and students"
          className={`${fieldBaseClass} ${errors.targetUser ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
        />
        {errors.targetUser && <p className="mt-1 text-xs text-red-600">{errors.targetUser}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Deadline (optional)</label>
        <input
          type="date"
          value={values.deadline}
          onChange={handleChange('deadline')}
          className={`${fieldBaseClass} border-slate-300 dark:border-slate-700`}
        />
      </div>

      <div className="flex flex-wrap justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="disabled:opacity-60" disabled={!isValid && Object.keys(errors).length > 0}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ProjectForm
