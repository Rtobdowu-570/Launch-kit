import { supabase, supabaseAdmin } from './supabase'
import type { Brand, Service, Deployment } from '@/types'
import type { Database } from '@/types/database'

type BrandRow = Database['public']['Tables']['brands']['Row']
type ServiceRow = Database['public']['Tables']['services']['Row']
type DeploymentRow = Database['public']['Tables']['deployments']['Row']

// Helper function to convert database row to Brand type
export function dbRowToBrand(row: BrandRow): Brand {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    domain: row.domain,
    tagline: row.tagline || '',
    bio: row.bio,
    colors: row.colors as { primary: string; accent: string; neutral: string },
    templateType: row.template_type as 'minimal-card' | 'magazine-grid' | 'terminal-retro',
    olaDomainId: row.ola_domain_id || undefined,
    olaContactId: row.ola_contact_id || undefined,
    olaZoneId: row.ola_zone_id || undefined,
    status: row.status as 'draft' | 'registering' | 'live' | 'failed',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// Helper function to convert database row to Service type
export function dbRowToService(row: ServiceRow): Service {
  return {
    id: row.id,
    brandId: row.brand_id,
    name: row.name,
    price: row.price || undefined,
    link: row.link,
    emoji: row.emoji || undefined,
    position: row.position,
    visible: row.visible,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// Helper function to convert database row to Deployment type
export function dbRowToDeployment(row: DeploymentRow): Deployment {
  return {
    id: row.id,
    brandId: row.brand_id,
    deploymentUrl: row.deployment_url,
    status: row.status as 'building' | 'live' | 'failed',
    buildLog: row.build_log || undefined,
    deployedAt: row.deployed_at || undefined,
    createdAt: row.created_at
  }
}

// Brand operations
export async function createBrand(brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('brands')
    .insert({
      user_id: brand.userId,
      name: brand.name,
      domain: brand.domain,
      tagline: brand.tagline,
      bio: brand.bio,
      colors: brand.colors,
      template_type: brand.templateType,
      ola_domain_id: brand.olaDomainId,
      ola_contact_id: brand.olaContactId,
      ola_zone_id: brand.olaZoneId,
      status: brand.status
    })
    .select()
    .single()

  if (error) throw error
  return dbRowToBrand(data)
}

export async function getBrandById(id: string) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data ? dbRowToBrand(data) : null
}

export async function getBrandByDomain(domain: string) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('domain', domain)
    .eq('status', 'live')
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data ? dbRowToBrand(data) : null
}

export async function getUserBrands(userId: string) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(dbRowToBrand)
}

export async function updateBrand(id: string, updates: Partial<Brand>) {
  const { data, error } = await supabase
    .from('brands')
    .update({
      name: updates.name,
      domain: updates.domain,
      tagline: updates.tagline,
      bio: updates.bio,
      colors: updates.colors,
      template_type: updates.templateType,
      ola_domain_id: updates.olaDomainId,
      ola_contact_id: updates.olaContactId,
      ola_zone_id: updates.olaZoneId,
      status: updates.status
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return dbRowToBrand(data)
}

// Service operations
export async function createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('services')
    .insert({
      brand_id: service.brandId,
      name: service.name,
      price: service.price,
      link: service.link,
      emoji: service.emoji,
      position: service.position,
      visible: service.visible
    })
    .select()
    .single()

  if (error) throw error
  return dbRowToService(data)
}

export async function getBrandServices(brandId: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('brand_id', brandId)
    .order('position', { ascending: true })

  if (error) throw error
  return data.map(dbRowToService)
}

export async function updateService(id: string, updates: Partial<Service>) {
  const { data, error } = await supabase
    .from('services')
    .update({
      name: updates.name,
      price: updates.price,
      link: updates.link,
      emoji: updates.emoji,
      position: updates.position,
      visible: updates.visible
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return dbRowToService(data)
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Deployment operations
export async function createDeployment(deployment: Omit<Deployment, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('deployments')
    .insert({
      brand_id: deployment.brandId,
      deployment_url: deployment.deploymentUrl,
      status: deployment.status,
      build_log: deployment.buildLog,
      deployed_at: deployment.deployedAt
    })
    .select()
    .single()

  if (error) throw error
  return dbRowToDeployment(data)
}

export async function getBrandDeployments(brandId: string) {
  const { data, error } = await supabase
    .from('deployments')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(dbRowToDeployment)
}

export async function updateDeployment(id: string, updates: Partial<Deployment>) {
  const { data, error } = await supabase
    .from('deployments')
    .update({
      deployment_url: updates.deploymentUrl,
      status: updates.status,
      build_log: updates.buildLog,
      deployed_at: updates.deployedAt
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return dbRowToDeployment(data)
}

// Utility functions
export async function isDomainAvailable(domain: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('is_domain_available', { domain_name: domain })

  if (error) throw error
  return data
}

export async function getUserBrandCount(userId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_user_brand_count', { user_uuid: userId })

  if (error) throw error
  return data
}

export async function getBrandServiceCount(brandId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_brand_service_count', { brand_uuid: brandId })

  if (error) throw error
  return data
}