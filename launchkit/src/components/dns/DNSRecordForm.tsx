"use client";

import { useState, useEffect } from "react";
import { DNSRecord } from "@/types";

interface DNSRecordFormProps {
  record?: DNSRecord;
  onSubmit: (record: DNSRecord | Omit<DNSRecord, 'id'>) => void;
  onCancel: () => void;
  loading: boolean;
}

const DNS_RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV'] as const;

export function DNSRecordForm({ record, onSubmit, onCancel, loading }: DNSRecordFormProps) {
  const [formData, setFormData] = useState<Omit<DNSRecord, 'id'>>({
    type: record?.type || 'A',
    name: record?.name || '@',
    content: record?.content || '',
    ttl: record?.ttl || 3600,
    priority: record?.priority,
    comment: record?.comment || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DNSRecord, string>>>({});

  // Initialize form data when record prop changes
  const initialFormData = record ? {
    type: record.type,
    name: record.name,
    content: record.content,
    ttl: record.ttl,
    priority: record.priority,
    comment: record.comment || '',
  } : {
    type: 'A' as const,
    name: '@',
    content: '',
    ttl: 3600,
    priority: undefined,
    comment: '',
  };

  useEffect(() => {
    setFormData(initialFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (name === 'ttl' || name === 'priority') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value, 10) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name as keyof DNSRecord]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DNSRecord, string>> = {};

    if (!formData.type) {
      newErrors.type = "Record type is required";
    }

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = "Name is required";
    }

    if (!formData.content || formData.content.trim().length === 0) {
      newErrors.content = "Content is required";
    }

    if (!formData.ttl || formData.ttl < 60) {
      newErrors.ttl = "TTL must be at least 60 seconds";
    }

    // MX records require priority
    if (formData.type === 'MX' && !formData.priority) {
      newErrors.priority = "Priority is required for MX records";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (record?.id) {
        onSubmit({ ...formData, id: record.id });
      } else {
        onSubmit(formData);
      }
    }
  };

  const showPriority = formData.type === 'MX' || formData.type === 'SRV';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Record Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Record Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${
              errors.type ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            {DNS_RECORD_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="@ or subdomain"
            disabled={loading}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          <p className="mt-1 text-xs text-gray-500">Use @ for root domain or enter subdomain name</p>
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${
              errors.content ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={
              formData.type === 'A' ? '192.0.2.1' :
              formData.type === 'AAAA' ? '2001:0db8::1' :
              formData.type === 'CNAME' ? 'example.com' :
              formData.type === 'MX' ? 'mail.example.com' :
              formData.type === 'TXT' ? 'v=spf1 include:_spf.example.com ~all' :
              'Record content'
            }
            disabled={loading}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        {/* TTL */}
        <div>
          <label htmlFor="ttl" className="block text-sm font-medium text-gray-700 mb-1">
            TTL (seconds) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="ttl"
            name="ttl"
            value={formData.ttl}
            onChange={handleChange}
            min="60"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${
              errors.ttl ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.ttl && <p className="mt-1 text-sm text-red-600">{errors.ttl}</p>}
          <p className="mt-1 text-xs text-gray-500">Default: 3600 (1 hour)</p>
        </div>

        {/* Priority (for MX and SRV records) */}
        {showPriority && (
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority {formData.type === 'MX' && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              id="priority"
              name="priority"
              value={formData.priority || ''}
              onChange={handleChange}
              min="0"
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${
                errors.priority ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
            <p className="mt-1 text-xs text-gray-500">Lower values have higher priority</p>
          </div>
        )}

        {/* Comment */}
        <div className={showPriority ? 'md:col-span-2' : 'md:col-span-2'}>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comment <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            placeholder="Add a note about this record"
            disabled={loading}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {record ? 'Update Record' : 'Add Record'}
        </button>
      </div>
    </form>
  );
}
