"use server";

import { getBrandById, updateBrand, deleteBrand } from '@/lib/database';
import { supabase } from '@/lib/supabase';
import type { Brand } from '@/types';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

/**
 * Get a brand by ID with ownership verification
 */
export async function getBrand(brandId: string): Promise<ApiResponse<Brand>> {
  try {
    // Get the current user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in',
        status: 401
      };
    }

    // Get brand with ownership verification
    const brand = await getBrandById(brandId, user.id);
    
    if (!brand) {
      return {
        success: false,
        error: 'Brand not found',
        status: 404
      };
    }

    return {
      success: true,
      data: brand
    };
  } catch (error) {
    console.error('Error getting brand:', error);
    
    const err = error as { code?: string; status?: number; message?: string };
    
    // Handle ownership errors
    if (err.code === 'FORBIDDEN' || err.status === 403) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to access this brand',
        status: 403
      };
    }

    return {
      success: false,
      error: err.message || 'Failed to get brand',
      status: err.status || 500
    };
  }
}

/**
 * Update a brand with ownership verification
 */
export async function updateBrandAction(
  brandId: string,
  updates: Partial<Brand>
): Promise<ApiResponse<Brand>> {
  try {
    // Get the current user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in',
        status: 401
      };
    }

    // Update brand with ownership verification
    const brand = await updateBrand(brandId, updates, user.id);

    return {
      success: true,
      data: brand,
      message: 'Brand updated successfully'
    };
  } catch (error) {
    console.error('Error updating brand:', error);
    
    const err = error as { code?: string; status?: number; message?: string };
    
    // Handle ownership errors
    if (err.code === 'FORBIDDEN' || err.status === 403) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to update this brand',
        status: 403
      };
    }

    // Handle not found errors
    if (err.code === 'NOT_FOUND' || err.status === 404) {
      return {
        success: false,
        error: 'Brand not found',
        status: 404
      };
    }

    return {
      success: false,
      error: err.message || 'Failed to update brand',
      status: err.status || 500
    };
  }
}

/**
 * Delete a brand with ownership verification
 */
export async function deleteBrandAction(brandId: string): Promise<ApiResponse<void>> {
  try {
    // Get the current user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in',
        status: 401
      };
    }

    // Delete brand with ownership verification
    await deleteBrand(brandId, user.id);

    return {
      success: true,
      message: 'Brand deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting brand:', error);
    
    const err = error as { code?: string; status?: number; message?: string };
    
    // Handle ownership errors
    if (err.code === 'FORBIDDEN' || err.status === 403) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to delete this brand',
        status: 403
      };
    }

    // Handle not found errors
    if (err.code === 'NOT_FOUND' || err.status === 404) {
      return {
        success: false,
        error: 'Brand not found',
        status: 404
      };
    }

    return {
      success: false,
      error: err.message || 'Failed to delete brand',
      status: err.status || 500
    };
  }
}
