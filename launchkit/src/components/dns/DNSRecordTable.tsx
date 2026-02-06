"use client";

import { DNSRecord } from "@/types";

interface DNSRecordTableProps {
  records: DNSRecord[];
  onEdit: (record: DNSRecord) => void;
  onDelete: (recordId: string) => void;
  loading: boolean;
}

export function DNSRecordTable({ records, onEdit, onDelete, loading }: DNSRecordTableProps) {
  const formatTTL = (ttl: number): string => {
    if (ttl < 60) return `${ttl}s`;
    if (ttl < 3600) return `${Math.floor(ttl / 60)}m`;
    if (ttl < 86400) return `${Math.floor(ttl / 3600)}h`;
    return `${Math.floor(ttl / 86400)}d`;
  };

  const getRecordTypeColor = (type: string): string => {
    switch (type) {
      case 'A':
        return 'bg-blue-100 text-blue-800';
      case 'AAAA':
        return 'bg-indigo-100 text-indigo-800';
      case 'CNAME':
        return 'bg-purple-100 text-purple-800';
      case 'MX':
        return 'bg-green-100 text-green-800';
      case 'TXT':
        return 'bg-yellow-100 text-yellow-800';
      case 'SRV':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (records.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TTL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRecordTypeColor(record.type)}`}>
                    {record.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={record.content}>
                  {record.content}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTTL(record.ttl)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.priority || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={record.comment}>
                  {record.comment || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(record)}
                    disabled={loading}
                    className="text-brand-primary hover:text-brand-primary/80 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => record.id && onDelete(record.id)}
                    disabled={loading || !record.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {records.map((record) => (
          <div key={record.id} className="border-b border-gray-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRecordTypeColor(record.type)}`}>
                {record.type}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(record)}
                  disabled={loading}
                  className="text-sm text-brand-primary hover:text-brand-primary/80 disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => record.id && onDelete(record.id)}
                  disabled={loading || !record.id}
                  className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Name:</span>
              <span className="text-sm font-medium text-gray-900 ml-2">{record.name}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Content:</span>
              <span className="text-sm text-gray-900 ml-2 break-all">{record.content}</span>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="text-xs text-gray-500">TTL:</span>
                <span className="text-sm text-gray-900 ml-2">{formatTTL(record.ttl)}</span>
              </div>
              {record.priority && (
                <div>
                  <span className="text-xs text-gray-500">Priority:</span>
                  <span className="text-sm text-gray-900 ml-2">{record.priority}</span>
                </div>
              )}
            </div>
            {record.comment && (
              <div>
                <span className="text-xs text-gray-500">Comment:</span>
                <span className="text-sm text-gray-900 ml-2">{record.comment}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
