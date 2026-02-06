"use client";

import { useState, useEffect } from "react";
import { DNSRecord } from "@/types";
import { listDNSRecords, createDNSRecord, updateDNSRecord, deleteDNSRecord, addGmailPreset } from "@/app/actions";
import { DNSRecordForm } from "./DNSRecordForm";
import { DNSRecordTable } from "./DNSRecordTable";

interface DNSManagerProps {
  zoneId: string;
  domain: string;
}

export function DNSManager({ zoneId, domain }: DNSManagerProps) {
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DNSRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load DNS records on mount
  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await listDNSRecords(zoneId);
      
      if (result.success && result.data) {
        setRecords(result.data);
      } else {
        setError(result.error as string || "Failed to load DNS records");
      }
    } catch (err) {
      setError("An error occurred while loading DNS records");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneId]);

  const handleAddRecord = async (record: Omit<DNSRecord, 'id'>) => {
    setActionLoading(true);
    setError(null);

    try {
      const result = await createDNSRecord(zoneId, record as DNSRecord);
      
      if (result.success) {
        await loadRecords();
        setShowAddForm(false);
      } else {
        setError(result.error as string || "Failed to create DNS record");
      }
    } catch (err) {
      setError("An error occurred while creating the DNS record");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRecord = async (record: DNSRecord) => {
    if (!record.id) return;
    
    setActionLoading(true);
    setError(null);

    try {
      const result = await updateDNSRecord(zoneId, record.id, record);
      
      if (result.success) {
        await loadRecords();
        setEditingRecord(null);
      } else {
        setError(result.error as string || "Failed to update DNS record");
      }
    } catch (err) {
      setError("An error occurred while updating the DNS record");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this DNS record?")) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const result = await deleteDNSRecord(zoneId, recordId);
      
      if (result.success) {
        await loadRecords();
      } else {
        setError(result.error as string || "Failed to delete DNS record");
      }
    } catch (err) {
      setError("An error occurred while deleting the DNS record");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddGmailPreset = async () => {
    if (!confirm("This will add Gmail MX records to your domain. Continue?")) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const result = await addGmailPreset(zoneId);
      
      if (result.success) {
        await loadRecords();
        alert(`Successfully added ${result.data?.length || 0} Gmail DNS records`);
      } else {
        setError(result.error as string || "Failed to add Gmail preset");
      }
    } catch (err) {
      setError("An error occurred while adding Gmail preset");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading DNS records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">DNS Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage DNS records for {domain}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddGmailPreset}
            disabled={actionLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Gmail Preset
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={actionLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add DNS Record
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="inline-flex text-red-400 hover:text-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingRecord) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingRecord ? "Edit DNS Record" : "Add DNS Record"}
          </h3>
          <DNSRecordForm
            record={editingRecord || undefined}
            onSubmit={editingRecord ? handleUpdateRecord : handleAddRecord}
            onCancel={() => {
              setShowAddForm(false);
              setEditingRecord(null);
            }}
            loading={actionLoading}
          />
        </div>
      )}

      {/* DNS Records Table */}
      <DNSRecordTable
        records={records}
        onEdit={setEditingRecord}
        onDelete={handleDeleteRecord}
        loading={actionLoading}
      />

      {/* Empty State */}
      {records.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No DNS records</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new DNS record.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary/90"
            >
              Add DNS Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
