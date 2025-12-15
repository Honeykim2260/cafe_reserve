import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { api } from '@/services/api'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'USER' | 'ADMIN' | 'CAFE_OWNER'
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  reservationCount: number
  totalSpent: number
}

const ROLE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'USER', label: '일반 사용자' },
  { value: 'CAFE_OWNER', label: '카페 사장' },
  { value: 'ADMIN', label: '관리자' },
] as const

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
] as const

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  const { user } = useAuthStore()
  const { addNotification } = useUiStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/')
      addNotification({
        type: 'error',
        title: '접근 권한 없음',
        message: '관리자만 접근할 수 있습니다'
      })
      return
    }
    
    loadUsers()
  }, [user, navigate, addNotification])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/users')
      const userData = response.data.data || []
      
      // Transform API response to match admin page format
      const transformedUsers = userData.map((user: any) => ({
        ...user,
        isActive: true, // Default to active
        reservationCount: 0, // Will need to be fetched separately
        totalSpent: 0, // Will need to be calculated
        lastLoginAt: user.updatedAt || user.createdAt
      }))
      
      setUsers(transformedUsers)
      addNotification({
        type: 'success',
        title: '사용자 목록 로드 완료',
        message: `${transformedUsers.length}명의 사용자를 불러왔습니다`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: '로드 실패',
        message: '사용자 목록을 불러올 수 없습니다'
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, isActive: !user.isActive }
            : user
        )
      )
      
      const targetUser = users.find(u => u.id === userId)
      addNotification({
        type: 'success',
        title: '사용자 상태 변경',
        message: `${targetUser?.name}님이 ${targetUser?.isActive ? '비활성화' : '활성화'}되었습니다`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: '상태 변경 실패',
        message: '사용자 상태를 변경할 수 없습니다'
      })
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, role: newRole as any }
            : user
        )
      )
      
      const targetUser = users.find(u => u.id === userId)
      addNotification({
        type: 'success',
        title: '사용자 권한 변경',
        message: `${targetUser?.name}님의 권한이 ${getRoleLabel(newRole)}(으)로 변경되었습니다`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: '권한 변경 실패',
        message: '사용자 권한을 변경할 수 없습니다'
      })
    }
  }

  const getRoleLabel = (role: string) => {
    const option = ROLE_OPTIONS.find(opt => opt.value === role)
    return option?.label || role
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      USER: 'bg-blue-100 text-blue-800',
      CAFE_OWNER: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-red-100 text-red-800'
    }
    
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatistics = () => {
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      users: users.filter(u => u.role === 'USER').length,
      cafeOwners: users.filter(u => u.role === 'CAFE_OWNER').length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      totalSpent: users.reduce((sum, u) => sum + u.totalSpent, 0)
    }
  }

  const stats = getStatistics()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mr-4"></div>
          <span className="text-gray-600">사용자 목록을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
          <p className="text-gray-600 mt-2">등록된 사용자를 관리하고 권한을 설정할 수 있습니다</p>
        </div>
        
        <button
          onClick={loadUsers}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          새로고침
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">전체 사용자</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-500">활성</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600">{stats.inactive}</p>
            <p className="text-sm text-gray-500">비활성</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">{stats.users}</p>
            <p className="text-sm text-gray-500">일반 사용자</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-purple-600">{stats.cafeOwners}</p>
            <p className="text-sm text-gray-500">카페 사장</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600">{stats.admins}</p>
            <p className="text-sm text-gray-500">관리자</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-700">₩{stats.totalSpent.toLocaleString()}</p>
            <p className="text-sm text-gray-500">총 이용금액</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="사용자 ID, 이름, 이메일로 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {ROLE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="sm:w-32">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">사용자가 없습니다</h3>
          <p className="text-gray-600">검색 조건에 맞는 사용자를 찾을 수 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">사용자 목록 ({filteredUsers.length}명)</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용자 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    권한/상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이용 통계
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    최근 접속
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((targetUser) => (
                  <tr key={targetUser.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{targetUser.name}</div>
                        <div className="text-sm text-gray-500">{targetUser.email}</div>
                        {targetUser.phone && (
                          <div className="text-sm text-gray-500">{targetUser.phone}</div>
                        )}
                        <div className="text-xs text-gray-400">
                          가입일: {new Date(targetUser.createdAt).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={getRoleBadge(targetUser.role)}>
                          {getRoleLabel(targetUser.role)}
                        </span>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            targetUser.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {targetUser.isActive ? '활성' : '비활성'}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>예약 {targetUser.reservationCount}회</div>
                        <div>총 ₩{targetUser.totalSpent.toLocaleString()}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {targetUser.lastLoginAt 
                        ? new Date(targetUser.lastLoginAt).toLocaleString('ko-KR')
                        : '접속 기록 없음'
                      }
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <select
                        value={targetUser.role}
                        onChange={(e) => updateUserRole(targetUser.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        disabled={targetUser.id === user?.id} // 자신의 권한은 변경 불가
                      >
                        <option value="USER">일반 사용자</option>
                        <option value="CAFE_OWNER">카페 사장</option>
                        <option value="ADMIN">관리자</option>
                      </select>
                      
                      <button
                        onClick={() => toggleUserStatus(targetUser.id)}
                        disabled={targetUser.id === user?.id} // 자신의 상태는 변경 불가
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          targetUser.isActive
                            ? 'text-red-600 hover:text-red-800 border border-red-300 hover:bg-red-50'
                            : 'text-green-600 hover:text-green-800 border border-green-300 hover:bg-green-50'
                        } ${targetUser.id === user?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {targetUser.isActive ? '비활성화' : '활성화'}
                      </button>
                      
                      <button
                        onClick={() => setSelectedUser(targetUser)}
                        className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}