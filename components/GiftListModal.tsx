// app/components/GiftListModal.tsx
'use client';

import { useState } from 'react';
import { X, Copy, CheckCircle, CreditCard, Gift } from 'lucide-react';

interface GiftListModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingData: any;
}

interface BankAccount {
  bank: string;
  accountHolder: string;
  iban?: string;
  accountNumber: string;
  nib?: string;
  currency: string;
}

interface GiftCategory {
  category: string;
  items: string[];
}

const giftList: GiftCategory[] = [
  {
    category: 'Cozinha',
    items: [
      'Conjunto de facas profissionais com suporte magnético',
      'Máquina de café expresso de design moderno',
      'Conjunto de porcelanas finas para jantares especiais',
      'Conjunto de panelas de porcelana',
      'Mala de talheres inoxidáveis',
      'Máquina de Arroz',
      'Panela de pressão',
      'Chapa eléctrica',
      'Cesto gourmet com azeites, queijos e chocolates artesanais',
    ],
  },
  {
    category: 'Decoração',
    items: [
      'Vasos de cerâmica ou cristal soprado',
      'Tapete artesanal em tons neutros',
      'Relógio de parede artístico e sofisticado',
      'Quadro de arte contemporânea',
      'Escultura decorativa minimalista (madeira, cerâmica ou metal)',
      'Fotografia artística emoldurada (paisagens moçambicanas ou abstratas)',
      'Abajur moderno para ambientes aconchegantes',
      'Vasos para jardim',
    ],
  },
];

const bankAccount: BankAccount = {
  bank: 'Millennium bim',
  accountHolder: 'Assa & Eleutério',
  accountNumber: '76620883',
  nib: '000100000007662088357',
  currency: 'MZN',
};

export default function GiftListModal({
  isOpen,
  onClose,
  weddingData,
}: GiftListModalProps) {
  const [activeTab, setActiveTab] = useState<'gifts' | 'bank'>('gifts');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="pr-12">
            <h2 className="mb-2 text-2xl font-bold">🎁 Lista de Presentes</h2>
            <p className="text-rose-100">
              Presentes para {weddingData.wedding_details.bride} &{' '}
              {weddingData.wedding_details.groom}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('gifts')}
              className={`flex-1 px-4 py-4 text-center font-medium transition-colors ${activeTab === 'gifts'
                  ? 'border-b-2 border-rose-600 bg-rose-50 text-rose-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Gift className="mr-2 inline h-5 w-5" />
              Lista de Presentes
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex-1 px-4 py-4 text-center font-medium transition-colors ${activeTab === 'bank'
                  ? 'border-b-2 border-rose-600 bg-rose-50 text-rose-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <CreditCard className="mr-2 inline h-5 w-5" />
              Conta Banco
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {activeTab === 'gifts' && (
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  Sugestões de Presentes
                </h3>
                <p className="text-sm text-gray-600">
                  Aqui estão algumas sugestões de presentes que gostaríamos de
                  receber
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {giftList.map((category, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <h4 className="mb-4 flex items-center text-lg font-bold text-gray-800">
                      <span className="mr-2 text-2xl">
                        {category.category === 'Cozinha' ? '🍳' : '🏺'}
                      </span>
                      {category.category}
                    </h4>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start text-sm text-gray-700"
                        >
                          <span className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-rose-50 p-6 text-center">
                <p className="text-sm text-rose-700">
                  💝 Estas são apenas sugestões! Qualquer presente dado com
                  carinho será muito bem recebido.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  Transferência Bancária
                </h3>
                <p className="text-sm text-gray-600">
                  Prefere fazer uma transferência? Utilize a conta bancária
                  abaixo.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                    <CreditCard className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {bankAccount.bank}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Titular: {bankAccount.accountHolder}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                        Número da Conta
                      </label>
                      <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
                        <code className="flex-1 font-mono text-sm text-gray-800">
                          {bankAccount.accountNumber}
                        </code>
                        <button
                          onClick={() =>
                            handleCopy(bankAccount.accountNumber, 'account')
                          }
                          className="ml-2 rounded p-1 transition-colors hover:bg-gray-200"
                          title="Copiar Número da Conta"
                        >
                          {copiedText === 'account' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                        NIB
                      </label>
                      <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3">
                        <code className="flex-1 font-mono text-sm text-gray-800">
                          {bankAccount.nib}
                        </code>
                        <button
                          onClick={() => handleCopy(bankAccount.nib!, 'nib')}
                          className="ml-2 rounded p-1 transition-colors hover:bg-gray-200"
                          title="Copiar NIB"
                        >
                          {copiedText === 'nib' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                        Moeda
                      </label>
                      <div className="rounded-lg bg-gray-100 p-3">
                        <code className="font-mono text-sm text-gray-800">
                          {bankAccount.currency}
                        </code>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-rose-50 p-4">
                      <div className="mb-2 flex items-center">
                        <span className="text-sm font-semibold text-rose-700">
                          Pagamento Rápido
                        </span>
                      </div>
                      <p className="text-xs text-rose-600">
                        Use o NIB no seu app bancário para transferência rápida
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-center text-xs text-gray-500">
                    💝 Qualquer valor é bem-vindo e muito apreciado pelos noivos
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-blue-50 p-6">
                <h4 className="mb-2 font-semibold text-blue-800">
                  📝 Como fazer a transferência:
                </h4>
                <ol className="list-inside list-decimal space-y-1 text-sm text-blue-700">
                  <li>Copie o NIB da conta acima</li>
                  <li>Acesse o seu app bancário ou internet banking</li>
                  <li>
                    Selecione &quot;Nova Transferência&quot; ou
                    &quot;Pagamento&quot;
                  </li>
                  <li>Cole o NIB e o nome do titular</li>
                  <li>
                    Adicione uma referência: &quot;Presente Casamento Assa &
                    Eleutério&quot;
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            ❤️ O seu carinho e presença são os melhores presentes que podemos
            receber!
          </p>
        </div>
      </div>
    </div>
  );
}
