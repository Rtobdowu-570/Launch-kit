'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserBrands, type GetUserBrandsOptions, type PaginatedBrands } from '@/lib/database'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { BrandCard } from '@/components/dashboard/BrandCard'
import { EmptyState } from '@/components/dashboard/EmptyState'
import type { Brand } from '@/types'
import { Rocket, TrendingUp, Users, Activity, Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type StatusFilter = 'all' | 'live' | 'deploying' | 'failed' | 'registering'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState<Brand[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBrands, setTotalBrands] = useState(0)
  const pageSize = 10

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return

      try {
        const options: GetUserBrandsOptions = {
          status: statusFilter,
          search: searchQuery,
          page: currentPage,
          pageSize
        }

        const result = await getUserBrands(user.id, options) as PaginatedBrands
        setBrands(result.brands)
        setTotalPages(result.totalPages)
        setTotalBrands(result.total)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      loadDashboardData()
    }
  }, [authLoading, user, statusFilter, searchQuery, currentPage])

  const handleEdit = (brandId: string) => {
    router.push(`/dashboard/brands/${brandId}/edit`)
  }

  const handleDelete = (brandId: string) => {
    // Remove the brand from the local state
    setBrands(brands.filter(b => b.id !== brandId))
    setTotalBrands(prev => prev - 1)
  }

  const handleRetry = (brandId: string) => {
    // TODO: Implement retry logic in future task
    console.log('Retry deployment for brand:', brandId)
    alert('Retry functionality will be implemented in a future task')
  }

  const handleView = (brandId: string) => {
    router.push(`/dashboard/brands/${brandId}`)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handleStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status)
    setCurrentPage(1) // Reset to first page on filter change
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const stats = [
    {
      name: 'Total Brands',
      value: totalBrands.toString(),
      change: '+12%',
      icon: Rocket,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Brands',
      value: brands.filter(b => b.status === 'live').length.toString(),
      change: '+8%',
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      name: 'Total Visits',
      value: '0',
      change: '+4%',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'Growth',
      value: '0%',
      change: '+2%',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  const statusOptions: { value: StatusFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: totalBrands },
    { value: 'live', label: 'Live', count: brands.filter(b => b.status === 'live').length },
    { value: 'deploying', label: 'Deploying', count: brands.filter(b => b.status === 'registering').length },
    { value: 'failed', label: 'Failed', count: brands.filter(b => b.status === 'failed').length }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-gray-600 mt-2">
            Here is an overview of your brands today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Active Brands Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Brands</h2>
            <Link
              href="/launch"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              Create New Brand
            </Link>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by domain or name..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusFilter(option.value)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        statusFilter === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                      {statusFilter === option.value && (
                        <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                          {option.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {brands.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, totalBrands)} of {totalBrands} brands
            </div>
          </div>

          {/* Brands Grid */}
          {brands.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand) => (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRetry={handleRetry}
                    onView={handleView}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Previous page"
                    className={`p-2 rounded-xl transition-all ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage = 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)

                      if (!showPage) {
                        // Show ellipsis
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-3 py-2 text-gray-400">
                              ...
                            </span>
                          )
                        }
                        return null
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Next page"
                    className={`p-2 rounded-xl transition-all ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
