export interface CasalData {
  id?: string;
  primeiroNome: string;
  sobrenome: string;
  parceiroPrimeiroNome: string;
  parceiroSobrenome: string;
  dataCasamento?: Date;
  provincia: string;
  cidade: string;
  telefone?: string;
  email?: string;
}

export interface FonteTexto {
  familia: string;
  tamanho: number;
  peso: 'normal' | 'bold' | 'light';
  estilo: 'normal' | 'italic';
  cor: string;
  decoracao?: 'none' | 'underline' | 'line-through';
  alinhamento?: 'left' | 'center' | 'right' | 'justify';
  espacamentoLinhas?: number;
  espacamentoLetras?: number;
}

export interface ElementoTexto {
  id: string;
  tipo: 'titulo' | 'subtitulo' | 'mensagem' | 'detalhes' | 'personalizado' | 'nomes' | 'data' | 'hora' | 'local' | 'rsvp';
  texto: string;
  posicao: { x: number; y: number };
  tamanho: { width: number; height: number };
  fonte: FonteTexto;
  editavel: boolean;
  visivel: boolean;
  bloqueado?: boolean;
  grupoId?: string;
  zIndex?: number;
}

export interface CanvasSettings {
  aspectRatio: 'square' | 'portrait' | 'landscape' | 'custom';
  width: number;
  height: number;
  backgroundFit: 'crop' | 'stretch' | 'tile' | 'fit';
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

export interface ConviteDesign {
  id?: string;
  casalId?: string;
  corPrimaria: string;
  corSecundaria: string;
  corTexto: string;
  fundoImagem?: string;
  fundoOpacidade: number;
  musicaUrl?: string;
  rsvpHabilitado: boolean;
  estiloTexto: 'classico' | 'moderno' | 'romantico';
  elementos: ElementoDesign[];
  elementosTexto: ElementoTexto[];
  mensagemPersonalizada?: string;
  // Canvas settings
  canvasSettings?: CanvasSettings;
  // Advanced editing fields
  tituloConviteTexto?: string;
  tituloConviteCor?: string;
  tituloConviteRotacao?: number;
  mensagemCor?: string;
  fonteTitulo?: string;
  fonteCorpo?: string;
  // Text style overrides for core, non-editable texts
  estiloTitulo?: FonteTexto;
  estiloNomes?: FonteTexto;
  estiloDetalhes?: FonteTexto; // date & location
  estiloMensagem?: FonteTexto;
  estiloRodape?: FonteTexto; // "Sua presença é o nosso maior presente"
  // Background gallery options
  backgroundGallery?: string[];
  backgroundIndex?: number;
  // Header decorations (icons flanking title)
  decoracaoCabecalho?: HeaderDecoration;
  // Middle decoration (between lines below the header)
  decoracaoCentral?: MiddleDecoration;
}

export interface ElementoDesign {
  id: string;
  tipo: 'coracao' | 'flor' | 'anel' | 'texto' | 'monograma';
  posicao: { x: number; y: number };
  tamanho: number;
  cor: string;
  rotacao?: number;
  texto?: string;
  editavel: boolean;
  visivel: boolean;
}

export interface HeaderDecoration {
  habilitado: boolean;
  tipo: 'coracao' | 'estrela' | 'flor' | 'cruz' | 'lacinho';
  cor: string;
  tamanho: number; // px
  espacamento: number; // gap between icon and title, px
  deslocamentoX: number; // nudge entire decoration/title row horizontally, px
}

export interface MiddleDecoration {
  habilitado: boolean;
  sincronizarComLaterais: boolean; // when true, inherit from HeaderDecoration
  tipo?: 'coracao' | 'estrela' | 'flor' | 'cruz' | 'lacinho';
  cor?: string;
  tamanho?: number; // px
  // Lines flanking the middle icon
  linhasVisiveis: boolean;
  linhasComprimento: 'curto' | 'medio' | 'longo';
  deslocamentoX: number; // px
  deslocamentoY: number; // px
}

export interface RSVP {
  id?: string;
  conviteId: string;
  nomeConvidado: string;
  email?: string;
  telefone?: string;
  numPessoas: number;
  mensagem?: string;
  confirmadoEm: Date;
  status: 'confirmado' | 'negado' | 'pendente';
}

export interface ConvitePublico {
  id: string;
  casal: CasalData;
  design: ConviteDesign;
  url: string;
  estatisticas?: {
    visualizacoes: number;
    confirmacoes: number;
    ultimaVisualizacao: Date;
  };
}