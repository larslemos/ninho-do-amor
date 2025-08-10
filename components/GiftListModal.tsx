"use client"

import { useState } from "react"
import { X, MapPin, Globe, Copy, CheckCircle, Store, CreditCard, QrCode } from "lucide-react"

interface GiftListModalProps {
  isOpen: boolean
  onClose: () => void
  weddingData: any
}

interface Shop {
  id: string
  name: string
  address: string
  website?: string
  phone?: string
  categories: string[]
  description: string
}

interface BankAccount {
  bank: string
  accountHolder: string
  iban: string
  accountNumber: string
  swift?: string
}

const shops: Shop[] = [
  {
    id: "1",
    name: "Casa & Decoração Polana",
    address: "Av. Julius Nyerere, 1234, Maputo",
    website: "www.casadecoracaopolana.co.mz",
    phone: "+258 21 123 456",
    categories: ["Decoração", "Casa", "Cozinha"],
    description: "Loja especializada em artigos para casa, decoração e utensílios de cozinha de alta qualidade.",
  },
  {
    id: "2",
    name: "Eletro Center Maputo",
    address: "Av. 24 de Julho, 567, Maputo",
    website: "www.electrocentermaputo.co.mz",
    phone: "+258 21 789 123",
    categories: ["Eletrodomésticos", "Eletrônicos"],
    description: "A maior loja de eletrodomésticos e eletrônicos de Maputo com as melhores marcas.",
  },
  {
    id: "3",
    name: "Têxtil Lar Matola",
    address: "Rua Principal, 890, Matola",
    phone: "+258 21 456 789",
    categories: ["Têxtil", "Cama", "Banho"],
    description: "Especializada em roupa de cama, banho, cortinas e tecidos para o lar.",
  },
  {
    id: "4",
    name: "Mobiliário Moderno",
    address: "Av. Acordos de Lusaka, 321, Maputo",
    website: "www.mobiliariomoderno.co.mz",
    phone: "+258 21 654 321",
    categories: ["Móveis", "Decoração"],
    description: "Móveis modernos e clássicos para todos os ambientes da casa.",
  },
]

const bankAccounts: BankAccount[] = [
  {
    bank: "BCI - Banco Comercial e de Investimentos",
    accountHolder: "Assa Eleutério Wedding",
    iban: "MZ59 0001 0000 0012 3456 7891 2",
    accountNumber: "123456789",
    swift: "BCIMZMZM",
  },
  {
    bank: "Standard Bank Moçambique",
    accountHolder: "Assa & Eleutério",
    iban: "MZ59 0011 0000 0098 7654 3210 1",
    accountNumber: "987654321",
  },
]

export default function GiftListModal({ isOpen, onClose, weddingData }: GiftListModalProps) {
  const [activeTab, setActiveTab] = useState<"shops" | "bank">("shops")
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(type)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="pr-12">
            <h2 className="text-2xl font-bold mb-2">🎁 Lista de Presentes</h2>
            <p className="text-rose-100">
              Presentes para {weddingData.wedding_details.bride} & {weddingData.wedding_details.groom}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("shops")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "shops"
                  ? "text-rose-600 border-b-2 border-rose-600 bg-rose-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Store className="w-5 h-5 inline mr-2" />
              Lojas Parceiras
            </button>
            <button
              onClick={() => setActiveTab("bank")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "bank"
                  ? "text-rose-600 border-b-2 border-rose-600 bg-rose-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <CreditCard className="w-5 h-5 inline mr-2" />
              Transferência Bancária
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "shops" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Nossas Lojas Parceiras</h3>
                <p className="text-gray-600 text-sm">
                  Escolha uma das nossas lojas parceiras e encontre o presente perfeito para nós!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {shops.map((shop) => (
                  <div
                    key={shop.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-1">{shop.name}</h4>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {shop.categories.map((category, index) => (
                            <span key={index} className="px-2 py-1 bg-rose-100 text-rose-600 text-xs rounded-full">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{shop.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-rose-500" />
                        {shop.address}
                      </div>

                      {shop.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="w-4 h-4 mr-2 text-rose-500">📞</span>
                          <a href={`tel:${shop.phone}`} className="hover:text-rose-600">
                            {shop.phone}
                          </a>
                        </div>
                      )}

                      {shop.website && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Globe className="w-4 h-4 mr-2 text-rose-500" />
                          <a
                            href={`https://${shop.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-rose-600"
                          >
                            {shop.website}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 italic">
                        💡 Mencione "Casamento Assa & Eleutério" para ofertas especiais
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bank" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Transferência Bancária</h3>
                <p className="text-gray-600 text-sm">
                  Prefere fazer uma transferência? Utilize uma das contas bancárias abaixo.
                </p>
              </div>

              {bankAccounts.map((account, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                      <CreditCard className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{account.bank}</h4>
                      <p className="text-gray-600 text-sm">Titular: {account.accountHolder}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">IBAN</label>
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                          <code className="text-sm font-mono text-gray-800 flex-1">{account.iban}</code>
                          <button
                            onClick={() => handleCopy(account.iban, `iban-${index}`)}
                            className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Copiar IBAN"
                          >
                            {copiedText === `iban-${index}` ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                          Número da Conta
                        </label>
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                          <code className="text-sm font-mono text-gray-800 flex-1">{account.accountNumber}</code>
                          <button
                            onClick={() => handleCopy(account.accountNumber, `account-${index}`)}
                            className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Copiar Número da Conta"
                          >
                            {copiedText === `account-${index}` ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {account.swift && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Código SWIFT
                          </label>
                          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                            <code className="text-sm font-mono text-gray-800 flex-1">{account.swift}</code>
                            <button
                              onClick={() => handleCopy(account.swift!, `swift-${index}`)}
                              className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                              title="Copiar SWIFT"
                            >
                              {copiedText === `swift-${index}` ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="bg-rose-50 rounded-lg p-4 mt-4">
                        <div className="flex items-center mb-2">
                          <QrCode className="w-4 h-4 text-rose-600 mr-2" />
                          <span className="text-sm font-semibold text-rose-700">Pagamento Rápido</span>
                        </div>
                        <p className="text-xs text-rose-600">
                          Use o IBAN no seu app bancário para transferência via QR Code
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      💝 Qualquer valor é bem-vindo e muito apreciado pelos noivos
                    </p>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 rounded-xl p-6 mt-6">
                <h4 className="font-semibold text-blue-800 mb-2">📝 Como fazer a transferência:</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Copie o IBAN da conta escolhida</li>
                  <li>Acesse o seu app bancário ou internet banking</li>
                  <li>Selecione "Nova Transferência" ou "Pagamento"</li>
                  <li>Cole o IBAN e o nome do titular</li>
                  <li>Adicione uma referência: "Presente Casamento Assa & Eleutério"</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            ❤️ O seu carinho e presença são os melhores presentes que podemos receber!
          </p>
        </div>
      </div>
    </div>
  )
}
