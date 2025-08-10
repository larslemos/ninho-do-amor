"use client"

import { useState } from "react"
import { User, Shield, Eye, Edit, Trash2, Plus, Mic, Palette, Car } from 'lucide-react'
import type { SystemUser, UserRole, Permission } from "@/types/mozambique-wedding"

const roleConfigs = {
  mc: {
    name: 'MC (Mestre de Cerimónias)',
    icon: Mic,
    color: 'bg-purple-500',
    description: 'Responsável pela condução dos eventos',
    defaultPermissions: [
      'view-full-program',
      'view-guest-list',
      'view-table-organization',
      'view-timeline',
      'view-emergency-contacts',
      'view-vip-notes'
    ] as Permission[]
  },
  decoradora: {
    name: 'Decoradora',
    icon: Palette,
    color: 'bg-pink-500',
    description: 'Responsável pela decoração e ambientação',
    defaultPermissions: [
      'view-layout',
      'view-guest-count',
      'view-themes-colors',
      'view-setup-schedule',
      'contact-couple',
      'view-reference-photos'
    ] as Permission[]
  },
  motorista: {
    name: 'Motorista/Transporte',
    icon: Car,
    color: 'bg-blue-500',
    description: 'Responsável pelo transporte dos noivos e convidados',
    defaultPermissions: [
      'view-complete-schedule',
      'view-all-addresses',
      'view-contact-info',
      'view-optimized-routes',
      'view-transport-list',
      'view-emergency-numbers'
    ] as Permission[]
  }
}

const permissionDescriptions: Record<Permission, string> = {
  'view-full-program': 'Visualizar programa completo do evento',
  'view-guest-list': 'Lista completa de convidados com nomes',
  'view-table-organization': 'Organização de mesas',
  'view-timeline': 'Timeline detalhada de eventos',
  'view-emergency-contacts': 'Contactos de emergência',
  'view-vip-notes': 'Notas especiais sobre convidados VIP',
  'view-layout': 'Layout e organização de mesas',
  'view-guest-count': 'Número total de convidados por evento',
  'view-themes-colors': 'Temas e cores escolhidos',
  'view-setup-schedule': 'Horários de montagem',
  'contact-couple': 'Contacto directo com os noivos',
  'view-reference-photos': 'Fotos de referência do local',
  'view-complete-schedule': 'Cronograma completo com horários',
  'view-all-addresses': 'Endereços de todos os locais',
  'view-contact-info': 'Contactos dos noivos e padrinhos',
  'view-optimized-routes': 'Rotas optimizadas entre locais',
  'view-transport-list': 'Lista de convidados que precisam transporte',
  'view-emergency-numbers': 'Números de emergência'
}

export default function UserManagement() {
  const [users, setUsers] = useState<SystemUser[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    contact: '',
    role: 'mc' as UserRole,
    permissions: [] as Permission[]
  })

  const handleAddUser = () => {
    const roleConfig = roleConfigs[newUser.role]
    const user: SystemUser = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      contact: newUser.contact,
      role: newUser.role,
      permissions: newUser.permissions.length > 0 ? newUser.permissions : roleConfig.defaultPermissions,
      weddingId: 'current-wedding'
    }
    
    setUsers(prev => [...prev, user])
    setNewUser({ name: '', contact: '', role: 'mc', permissions: [] })
    setShowAddModal(false)
  }

  const handleRoleChange = (role: UserRole) => {
    const roleConfig = roleConfigs[role]
    setNewUser(prev => ({
      ...prev,
      role,
      permissions: roleConfig.defaultPermissions
    }))
  }

  const togglePermission = (permission: Permission) => {
    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestão de Acessos ao Sistema</h1>
          <p className="text-gray-600">Configure os utilizadores e suas permissões</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Utilizador
        </button>
      </div>

      {/* Role Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {Object.entries(roleConfigs).map(([roleKey, config]) => {
          const Icon = config.icon
          const usersInRole = users.filter(u => u.role === roleKey).length
          
          return (
            <div key={roleKey} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{config.name}</h3>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{usersInRole}</span>
                <span className="text-sm text-gray-500">utilizador{usersInRole !== 1 ? 'es' : ''}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Utilizadores Registados</h2>
        </div>
        
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum utilizador registado</h3>
            <p className="text-gray-600 mb-6">Adicione utilizadores para dar acesso ao sistema</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Adicionar Primeiro Utilizador
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilizador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissões
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const roleConfig = roleConfigs[user.role]
                  const Icon = roleConfig.icon
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${roleConfig.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {roleConfig.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{user.permissions.length} permissões</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Ver permissões"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Adicionar Novo Utilizador</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contacto *
                  </label>
                  <input
                    type="text"
                    value={newUser.contact}
                    onChange={(e) => setNewUser(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Ex: +258 84 123 4567"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Função *
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(roleConfigs).map(([roleKey, config]) => {
                    const Icon = config.icon
                    const isSelected = newUser.role === roleKey
                    
                    return (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => handleRoleChange(roleKey as UserRole)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected 
                            ? 'border-rose-500 bg-rose-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900">{config.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Permissões
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    {newUser.permissions.map((permission) => (
                      <label key={permission} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => togglePermission(permission)}
                          className="mt-1 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900 block">
                            {permissionDescriptions[permission]}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.contact}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Adicionar Utilizador
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${roleConfigs[editingUser.role].color} rounded-lg flex items-center justify-center`}>
                  {(() => {
                    const Icon = roleConfigs[editingUser.role].icon
                    return <Icon className="w-6 h-6 text-white" />
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{editingUser.name}</h3>
                  <p className="text-gray-600">{roleConfigs[editingUser.role].name}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Informações de Contacto</h4>
                <p className="text-gray-600">{editingUser.contact}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Permissões Atribuídas</h4>
                <div className="space-y-3">
                  {editingUser.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">
                        {permissionDescriptions[permission]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
