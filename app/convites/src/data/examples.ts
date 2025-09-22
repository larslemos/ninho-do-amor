import { CasalData, ConviteDesign } from '@/types/wedding';

export interface ExampleInvitation {
  id: string;
  name: string;
  description: string;
  category: 'classico' | 'moderno' | 'romantico' | 'tropical' | 'elegante';
  casal: Partial<CasalData>;
  design: Partial<ConviteDesign>;
  previewImage?: string;
}

export const exampleInvitations: ExampleInvitation[] = [
  {
    id: 'classico-verde',
    name: 'Sage Clássico',
    description: 'Elegante e tradicional com tons de verde sage',
    category: 'classico',
    casal: {
      primeiroNome: 'Maria',
      sobrenome: 'Santos',
      parceiroPrimeiroNome: 'João',
      parceiroSobrenome: 'Silva',
      dataCasamento: new Date('2025-06-15'),
      cidade: 'Maputo',
      provincia: 'Maputo Cidade'
    },
    design: {
      corPrimaria: 'hsl(142, 35%, 45%)',
      corSecundaria: 'hsl(30, 54%, 98%)',
      corTexto: 'hsl(160, 25%, 15%)',
      fundoOpacidade: 15,
      mensagemPersonalizada: 'O amor é a ponte entre duas almas',
      decoracaoCabecalho: {
        habilitado: true,
        tipo: 'coracao',
        cor: 'hsl(142, 35%, 45%)',
        tamanho: 18,
        espacamento: 8,
        deslocamentoX: 0
      },
      decoracaoCentral: {
        habilitado: true,
        sincronizarComLaterais: true,
        linhasVisiveis: true,
        linhasComprimento: 'medio',
        deslocamentoX: 0,
        deslocamentoY: 0
      }
    }
  },
  {
    id: 'romantico-rosa',
    name: 'Rosa Romântico',
    description: 'Delicado e romântico em tons de rosa',
    category: 'romantico',
    casal: {
      primeiroNome: 'Ana',
      sobrenome: 'Costa',
      parceiroPrimeiroNome: 'Pedro',
      parceiroSobrenome: 'Oliveira',
      dataCasamento: new Date('2025-09-20'),
      cidade: 'Beira',
      provincia: 'Sofala'
    },
    design: {
      corPrimaria: 'hsl(350, 45%, 65%)',
      corSecundaria: 'hsl(350, 45%, 95%)',
      corTexto: 'hsl(350, 35%, 25%)',
      fundoOpacidade: 20,
      mensagemPersonalizada: 'No amor encontramos a felicidade verdadeira',
      decoracaoCabecalho: {
        habilitado: true,
        tipo: 'flor',
        cor: 'hsl(350, 45%, 65%)',
        tamanho: 20,
        espacamento: 10,
        deslocamentoX: 0
      },
      decoracaoCentral: {
        habilitado: true,
        sincronizarComLaterais: true,
        linhasVisiveis: true,
        linhasComprimento: 'longo',
        deslocamentoX: 0,
        deslocamentoY: 0
      }
    }
  },
  {
    id: 'moderno-azul',
    name: 'Azul Moderno',
    description: 'Contemporâneo e sofisticado em azul',
    category: 'moderno',
    casal: {
      primeiroNome: 'Sofia',
      sobrenome: 'Fernandes',
      parceiroPrimeiroNome: 'Miguel',
      parceiroSobrenome: 'Rodrigues',
      dataCasamento: new Date('2025-07-12'),
      cidade: 'Nampula',
      provincia: 'Nampula'
    },
    design: {
      corPrimaria: 'hsl(210, 55%, 55%)',
      corSecundaria: 'hsl(210, 45%, 98%)',
      corTexto: 'hsl(210, 35%, 25%)',
      fundoOpacidade: 10,
      mensagemPersonalizada: 'Juntos construímos nosso futuro',
      decoracaoCabecalho: {
        habilitado: true,
        tipo: 'estrela',
        cor: 'hsl(210, 55%, 55%)',
        tamanho: 16,
        espacamento: 6,
        deslocamentoX: 0
      },
      decoracaoCentral: {
        habilitado: true,
        sincronizarComLaterais: true,
        linhasVisiveis: true,
        linhasComprimento: 'curto',
        deslocamentoX: 0,
        deslocamentoY: 0
      }
    }
  },
  {
    id: 'tropical-ouro',
    name: 'Tropical Dourado',
    description: 'Vibrante e tropical com toques dourados',
    category: 'tropical',
    casal: {
      primeiroNome: 'Isabel',
      sobrenome: 'Machado',
      parceiroPrimeiroNome: 'Carlos',
      parceiroSobrenome: 'Pereira',
      dataCasamento: new Date('2025-11-08'),
      cidade: 'Pemba',
      provincia: 'Cabo Delgado'
    },
    design: {
      corPrimaria: 'hsl(45, 90%, 55%)',
      corSecundaria: 'hsl(45, 45%, 98%)',
      corTexto: 'hsl(45, 35%, 25%)',
      fundoOpacidade: 25,
      mensagemPersonalizada: 'Sob o sol de Moçambique, celebramos nosso amor',
      decoracaoCabecalho: {
        habilitado: true,
        tipo: 'flor',
        cor: 'hsl(45, 90%, 55%)',
        tamanho: 22,
        espacamento: 12,
        deslocamentoX: 0
      },
      decoracaoCentral: {
        habilitado: true,
        sincronizarComLaterais: true,
        linhasVisiveis: true,
        linhasComprimento: 'medio',
        deslocamentoX: 0,
        deslocamentoY: 0
      }
    }
  },
  {
    id: 'elegante-lavanda',
    name: 'Lavanda Elegante',
    description: 'Sofisticado e elegante em tons de lavanda',
    category: 'elegante',
    casal: {
      primeiroNome: 'Beatriz',
      sobrenome: 'Almeida',
      parceiroPrimeiroNome: 'André',
      parceiroSobrenome: 'Martins',
      dataCasamento: new Date('2025-10-25'),
      cidade: 'Quelimane',
      provincia: 'Zambézia'
    },
    design: {
      corPrimaria: 'hsl(270, 45%, 65%)',
      corSecundaria: 'hsl(270, 25%, 98%)',
      corTexto: 'hsl(270, 35%, 25%)',
      fundoOpacidade: 18,
      mensagemPersonalizada: 'Um amor que transcende o tempo',
      decoracaoCabecalho: {
        habilitado: true,
        tipo: 'lacinho',
        cor: 'hsl(270, 45%, 65%)',
        tamanho: 19,
        espacamento: 9,
        deslocamentoX: 0
      },
      decoracaoCentral: {
        habilitado: true,
        sincronizarComLaterais: true,
        linhasVisiveis: true,
        linhasComprimento: 'longo',
        deslocamentoX: 0,
        deslocamentoY: 0
      }
    }
  },
  {
    id: 'minimalista-verde',
    name: 'Verde Minimalista',
    description: 'Simples e elegante com foco no essencial',
    category: 'moderno',
    casal: {
      primeiroNome: 'Laura',
      sobrenome: 'Gomes',
      parceiroPrimeiroNome: 'Tiago',
      parceiroSobrenome: 'Lopes',
      dataCasamento: new Date('2025-08-30'),
      cidade: 'Tete',
      provincia: 'Tete'
    },
    design: {
      corPrimaria: 'hsl(150, 25%, 55%)',
      corSecundaria: 'hsl(150, 15%, 98%)',
      corTexto: 'hsl(150, 35%, 25%)',
      fundoOpacidade: 5,
      mensagemPersonalizada: 'Simplicidade é a maior sofisticação',
      decoracaoCabecalho: {
        habilitado: true,
        tipo: 'cruz',
        cor: 'hsl(150, 25%, 55%)',
        tamanho: 16,
        espacamento: 6,
        deslocamentoX: 0
      },
      decoracaoCentral: {
        habilitado: true,
        sincronizarComLaterais: true,
        linhasVisiveis: true,
        linhasComprimento: 'curto',
        deslocamentoX: 0,
        deslocamentoY: 0
      }
    }
  }
];

export const getExamplesByCategory = (category?: string): ExampleInvitation[] => {
  if (!category) return exampleInvitations;
  return exampleInvitations.filter(example => example.category === category);
};

export const getExampleById = (id: string): ExampleInvitation | undefined => {
  return exampleInvitations.find(example => example.id === id);
};
