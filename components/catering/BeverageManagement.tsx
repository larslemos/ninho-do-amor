'use client';

import { useState } from 'react';
import { Wine, Coffee, Droplets, Plus, Calculator, ShoppingCart, TrendingUp } from 'lucide-react';
import type { Beverage, BeverageCategory } from '@/types/mozambique-wedding';

const beverageCategories = [
  {
    category: 'alcoholic' as BeverageCategory,
    name: 'Bebidas Alcoólicas',
    icon: Wine,
    color: 'bg-red-500',
    subcategories: ['Cervejas', 'Vinhos', 'Destilados', 'Cocktails'],
  },
  {
    category: 'non-alcoholic' as BeverageCategory,
    name: 'Bebidas Não-Alcoólicas',
    icon: Droplets,
    color: 'bg-blue-500',
    subcategories: ['Refrigerantes', 'Sumos Naturais', 'Água'],
  },
  {
    category: 'traditional' as BeverageCategory,
    name: 'Bebidas Tradicionais',
    icon: Wine,
    color: 'bg-orange-500',
    subcategories: ['Sura', 'Nipa', 'Outras'],
  },
  {
    category: 'hot-drinks' as BeverageCategory,
    name: 'Bebidas Quentes',
    icon: Coffee,
    color: 'bg-amber-500',
    subcategories: ['Café', 'Chá'],
  },
];

const defaultBeverages: Omit<Beverage, 'id' | 'weddingId'>[] = [
  // Cervejas
  {
    name: '2M',
    category: 'alcoholic',
    subcategory: 'Cervejas',
    pricePerUnit: 80,
    supplier: 'Distribuidor Local',
    quantityNeeded: 0,
  },
  {
    name: 'Laurentina',
    category: 'alcoholic',
    subcategory: 'Cervejas',
    pricePerUnit: 75,
    supplier: 'Distribuidor Local',
    quantityNeeded: 0,
  },
  {
    name: 'Manica',
    category: 'alcoholic',
    subcategory: 'Cervejas',
    pricePerUnit: 70,
    supplier: 'Distribuidor Local',
    quantityNeeded: 0,
  },

  // Vinhos
  {
    name: 'Vinho Tinto Nacional',
    category: 'alcoholic',
    subcategory: 'Vinhos',
    pricePerUnit: 350,
    supplier: 'Adega Moçambique',
    quantityNeeded: 0,
  },
  {
    name: 'Vinho Branco Nacional',
    category: 'alcoholic',
    subcategory: 'Vinhos',
    pricePerUnit: 320,
    supplier: 'Adega Moçambique',
    quantityNeeded: 0,
  },

  // Destilados
  {
    name: 'Whisky',
    category: 'alcoholic',
    subcategory: 'Destilados',
    pricePerUnit: 1200,
    supplier: 'Importadora Premium',
    quantityNeeded: 0,
  },
  {
    name: 'Vodka',
    category: 'alcoholic',
    subcategory: 'Destilados',
    pricePerUnit: 800,
    supplier: 'Importadora Premium',
    quantityNeeded: 0,
  },

  // Refrigerantes
  {
    name: 'Coca-Cola',
    category: 'non-alcoholic',
    subcategory: 'Refrigerantes',
    pricePerUnit: 45,
    supplier: 'Distribuidor Coca-Cola',
    quantityNeeded: 0,
  },
  {
    name: 'Fanta',
    category: 'non-alcoholic',
    subcategory: 'Refrigerantes',
    pricePerUnit: 45,
    supplier: 'Distribuidor Coca-Cola',
    quantityNeeded: 0,
  },
  {
    name: 'Sprite',
    category: 'non-alcoholic',
    subcategory: 'Refrigerantes',
    pricePerUnit: 45,
    supplier: 'Distribuidor Coca-Cola',
    quantityNeeded: 0,
  },
  {
    name: 'Sumol',
    category: 'non-alcoholic',
    subcategory: 'Refrigerantes',
    pricePerUnit: 50,
    supplier: 'Distribuidor Sumol',
    quantityNeeded: 0,
  },

  // Sumos Naturais
  {
    name: 'Sumo de Manga',
    category: 'non-alcoholic',
    subcategory: 'Sumos Naturais',
    pricePerUnit: 60,
    supplier: 'Produtor Local',
    quantityNeeded: 0,
  },
  {
    name: 'Sumo de Maracujá',
    category: 'non-alcoholic',
    subcategory: 'Sumos Naturais',
    pricePerUnit: 65,
    supplier: 'Produtor Local',
    quantityNeeded: 0,
  },
  {
    name: 'Sumo de Ananás',
    category: 'non-alcoholic',
    subcategory: 'Sumos Naturais',
    pricePerUnit: 55,
    supplier: 'Produtor Local',
    quantityNeeded: 0,
  },
  {
    name: 'Sumo de Caju',
    category: 'non-alcoholic',
    subcategory: 'Sumos Naturais',
    pricePerUnit: 70,
    supplier: 'Produtor Local',
    quantityNeeded: 0,
  },

  // Água
  {
    name: 'Água Natural',
    category: 'non-alcoholic',
    subcategory: 'Água',
    pricePerUnit: 25,
    supplier: 'Águas de Moçambique',
    quantityNeeded: 0,
  },
  {
    name: 'Água com Gás',
    category: 'non-alcoholic',
    subcategory: 'Água',
    pricePerUnit: 35,
    supplier: 'Águas de Moçambique',
    quantityNeeded: 0,
  },

  // Bebidas Tradicionais
  {
    name: 'Sura',
    category: 'traditional',
    subcategory: 'Sura',
    pricePerUnit: 40,
    supplier: 'Produtor Tradicional',
    quantityNeeded: 0,
  },
  {
    name: 'Nipa',
    category: 'traditional',
    subcategory: 'Nipa',
    pricePerUnit: 35,
    supplier: 'Produtor Tradicional',
    quantityNeeded: 0,
  },

  // Bebidas Quentes
  {
    name: 'Café',
    category: 'hot-drinks',
    subcategory: 'Café',
    pricePerUnit: 30,
    supplier: 'Café Moçambique',
    quantityNeeded: 0,
  },
  {
    name: 'Chá',
    category: 'hot-drinks',
    subcategory: 'Chá',
    pricePerUnit: 25,
    supplier: 'Chá Nacional',
    quantityNeeded: 0,
  },
];

export default function BeverageManagement() {
  const [beverages, setBeverages] = useState<Beverage[]>(
    defaultBeverages.map((bev, index) => ({
      ...bev,
      id: `bev-${index}`,
      weddingId: 'current-wedding',
    }))
  );
  const [guestCount, setGuestCount] = useState(150);
  const [activeCategory, setActiveCategory] = useState<BeverageCategory>('alcoholic');
  const [showCalculator, setShowCalculator] = useState(false);

  const updateQuantity = (beverageId: string, quantity: number) => {
    setBeverages((prev) =>
      prev.map((bev) =>
        bev.id === beverageId ? { ...bev, quantityNeeded: Math.max(0, quantity) } : bev
      )
    );
  };

  const calculateAutoQuantities = () => {
    setBeverages((prev) =>
      prev.map((bev) => {
        let multiplier = 0;

        // Cálculo baseado no tipo de bebida e número de convidados
        switch (bev.subcategory) {
          case 'Cervejas':
            multiplier = 3; // 3 cervejas por pessoa
            break;
          case 'Vinhos':
            multiplier = 0.5; // 0.5 garrafas por pessoa
            break;
          case 'Destilados':
            multiplier = 0.1; // 0.1 garrafas por pessoa
            break;
          case 'Refrigerantes':
            multiplier = 2; // 2 refrigerantes por pessoa
            break;
          case 'Sumos Naturais':
            multiplier = 1; // 1 sumo por pessoa
            break;
          case 'Água':
            multiplier = bev.name.includes('Natural') ? 2 : 0.5; // 2 águas naturais, 0.5 com gás
            break;
          case 'Sura':
          case 'Nipa':
            multiplier = 0.3; // 0.3 por pessoa (bebida tradicional)
            break;
          case 'Café':
          case 'Chá':
            multiplier = 1; // 1 por pessoa
            break;
          default:
            multiplier = 1;
        }

        return {
          ...bev,
          quantityNeeded: Math.ceil(guestCount * multiplier),
        };
      })
    );
  };

  const getTotalCost = () => {
    return beverages.reduce((total, bev) => total + bev.quantityNeeded * bev.pricePerUnit, 0);
  };

  const getCategoryBeverages = (category: BeverageCategory) => {
    return beverages.filter((bev) => bev.category === category);
  };

  const getCategoryCost = (category: BeverageCategory) => {
    return getCategoryBeverages(category).reduce(
      (total, bev) => total + bev.quantityNeeded * bev.pricePerUnit,
      0
    );
  };

  const generateShoppingList = () => {
    const list = beverages
      .filter((bev) => bev.quantityNeeded > 0)
      .reduce(
        (acc, bev) => {
          if (!acc[bev.supplier]) {
            acc[bev.supplier] = [];
          }
          acc[bev.supplier].push({
            name: bev.name,
            quantity: bev.quantityNeeded,
            price: bev.pricePerUnit,
            total: bev.quantityNeeded * bev.pricePerUnit,
          });
          return acc;
        },
        {} as Record<string, any[]>
      );

    return list;
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Gestão de Bebidas</h1>
          <p className="text-gray-600">Planeie e calcule as bebidas para o seu casamento</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCalculator(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Calculator className="h-5 w-5" />
            Calculadora
          </button>
          <button
            onClick={calculateAutoQuantities}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            <TrendingUp className="h-5 w-5" />
            Calcular Automático
          </button>
        </div>
      </div>

      {/* Guest Count Input */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Número de Convidados</h3>
            <p className="text-gray-600">Base para cálculo das quantidades</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Convidados:</label>
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-center font-bold focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {beverageCategories.map((category) => {
              const Icon = category.icon;
              const categoryBeverages = getCategoryBeverages(category.category);
              const categoryCost = getCategoryCost(category.category);

              return (
                <button
                  key={category.category}
                  onClick={() => setActiveCategory(category.category)}
                  className={`flex-1 border-b-2 px-6 py-4 text-center font-medium transition-colors ${
                    activeCategory === category.category
                      ? 'border-rose-600 bg-rose-50 text-rose-600'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span>{category.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {categoryBeverages.filter((b) => b.quantityNeeded > 0).length} itens •{' '}
                    {categoryCost.toLocaleString()} MT
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Category Content */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getCategoryBeverages(activeCategory).map((beverage) => (
              <div key={beverage.id} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="mb-1 font-semibold text-gray-900">{beverage.name}</h4>
                    <p className="text-sm text-gray-600">{beverage.subcategory}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {beverage.pricePerUnit} MT
                    </div>
                    <div className="text-xs text-gray-500">por unidade</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="mb-1 text-xs text-gray-500">Fornecedor: {beverage.supplier}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      value={beverage.quantityNeeded}
                      onChange={(e) => updateQuantity(beverage.id, parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                      min="0"
                    />
                  </div>
                  <div className="text-right">
                    <div className="mb-1 text-xs text-gray-500">Total</div>
                    <div className="font-bold text-gray-900">
                      {(beverage.quantityNeeded * beverage.pricePerUnit).toLocaleString()} MT
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary and Shopping List */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Cost Summary */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900">Resumo de Custos</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {beverageCategories.map((category) => {
                const cost = getCategoryCost(category.category);
                const Icon = category.icon;

                return (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 ${category.color} flex items-center justify-center rounded-lg`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{cost.toLocaleString()} MT</span>
                  </div>
                );
              })}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-bold text-gray-900">Total Geral</span>
                  <span className="font-bold text-rose-600">
                    {getTotalCost().toLocaleString()} MT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shopping List */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900">Lista de Compras</h3>
            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700">
              <ShoppingCart className="h-4 w-4" />
              Exportar
            </button>
          </div>
          <div className="p-6">
            {Object.entries(generateShoppingList()).map(([supplier, items]) => (
              <div key={supplier} className="mb-6 last:mb-0">
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                  <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                  {supplier}
                </h4>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="ml-2 text-gray-500">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">{item.total.toLocaleString()} MT</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Subtotal {supplier}:</span>
                    <span>
                      {items.reduce((sum, item) => sum + item.total, 0).toLocaleString()} MT
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900">Calculadora de Bebidas</h3>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-4 font-semibold text-gray-900">Recomendações por Pessoa</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Cervejas:</span>
                      <span className="font-medium">3 unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refrigerantes:</span>
                      <span className="font-medium">2 unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Água:</span>
                      <span className="font-medium">2 unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vinho:</span>
                      <span className="font-medium">0.5 garrafas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sumos:</span>
                      <span className="font-medium">1 unidade</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-4 font-semibold text-gray-900">Para {guestCount} Convidados</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Cervejas:</span>
                      <span className="font-medium">{guestCount * 3} unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refrigerantes:</span>
                      <span className="font-medium">{guestCount * 2} unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Água:</span>
                      <span className="font-medium">{guestCount * 2} unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vinho:</span>
                      <span className="font-medium">{Math.ceil(guestCount * 0.5)} garrafas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sumos:</span>
                      <span className="font-medium">{guestCount} unidades</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-gray-200 p-6">
              <button
                onClick={calculateAutoQuantities}
                className="flex-1 rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-700"
              >
                Aplicar Cálculos
              </button>
              <button
                onClick={() => setShowCalculator(false)}
                className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
