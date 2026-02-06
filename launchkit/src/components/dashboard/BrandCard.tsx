"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from "lucide-react";
import type { Brand } from "@/types";
import { deleteBrandAction } from "@/app/brand-actions";

interface BrandCardProps {
  brand: Brand;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRetry?: (id: string) => void;
  onView?: (id: string) => void;
}

export function BrandCard({
  brand,
  onEdit,
  onDelete,
  onRetry,
  onView
}: BrandCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteBrandAction(brand.id);
      if (result.success) {
        onDelete?.(brand.id);
      } else {
        console.error("Failed to delete brand:", result.error);
        alert(result.error || "Failed to delete brand");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("An error occurred while deleting the brand");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleRetry = () => {
    onRetry?.(brand.id);
  };

  const handleEdit = () => {
    onEdit?.(brand.id);
  };

  const handleView = () => {
    onView?.(brand.id);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "live":
        return {
          label: "Live",
          icon: CheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          borderColor: "border-green-200"
        };
      case "deploying":
        return {
          label: "Deploying",
          icon: Loader2,
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          borderColor: "border-blue-200"
        };
      case "registering":
        return {
          label: "Registering",
          icon: Clock,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200"
        };
      case "configuring_dns":
        return {
          label: "Configuring DNS",
          icon: Clock,
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
          borderColor: "border-purple-200"
        };
      case "failed":
        return {
          label: "Failed",
          icon: AlertCircle,
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-200"
        };
      default:
        return {
          label: status,
          icon: Clock,
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-200"
        };
    }
  };

  const statusConfig = getStatusConfig(brand.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      {/* Brand Header with Gradient */}
      <motion.div
        className="h-32 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.accent})`
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        
        {/* Status Badge - Positioned in header */}
        <div className="absolute top-4 right-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
          >
            <StatusIcon
              className={`w-3.5 h-3.5 ${
                brand.status === "deploying" ? "animate-spin" : ""
              }`}
            />
            {statusConfig.label}
          </motion.div>
        </div>
      </motion.div>

      {/* Brand Content */}
      <div className="p-6">
        {/* Brand Name and Tagline */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
            {brand.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
            {brand.tagline || "No tagline"}
          </p>
        </div>

        {/* Domain */}
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-3 p-2 bg-gray-50 rounded-lg">
          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate font-medium">{brand.domain}</span>
        </div>

        {/* Creation Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>Created {formatDate(brand.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* View/Manage Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium text-sm"
          >
            <Eye className="w-4 h-4" />
            View
          </motion.button>

          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEdit}
            className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
            title="Edit brand"
          >
            <Edit className="w-4 h-4" />
          </motion.button>

          {/* Retry Button (only for failed status) */}
          {brand.status === "failed" && (
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetry}
              className="p-2.5 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-all"
              title="Retry deployment"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          )}

          {/* Delete Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-2.5 rounded-xl transition-all ${
              showDeleteConfirm
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={showDeleteConfirm ? "Click again to confirm" : "Delete brand"}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Delete Confirmation Message */}
        {showDeleteConfirm && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-xs text-red-600 mt-2 text-center"
          >
            Click delete again to confirm
          </motion.p>
        )}

        {/* Visit Live Site Button (only for live status) */}
        {brand.status === "live" && (
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            href={`https://${brand.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Live Site
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}
