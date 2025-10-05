import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CasalData, ConviteDesign, ElementoDesign, ElementoTexto, FonteTexto, CanvasSettings } from '@/types/wedding';
import { Heart, Flower, Upload, Palette, Sparkles, Type, Plus, Trash2, Share2, RotateCw, Move, Maximize2, Grid, Lock, Unlock, Star, Cross, Ribbon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvitationPreview } from './invitation-preview';
import { fontOptions, getFontFamily, loadGoogleFonts } from '@/data/fonts';
import { backgroundOptions, getBackgroundsByCategory } from '@/data/backgrounds';

interface DesignCustomizerProps {
  casal: Partial<CasalData>;
  design: Partial<ConviteDesign>;
  onDesignChange: (design: Partial<ConviteDesign>) => void;
  onNext: () => void;
  onBack: () => void;
}

const colorPalettes = [
  { name: 'Sage Clássico', primary: 'hsl(142, 35%, 45%)', secondary: 'hsl(30, 54%, 98%)', text: 'hsl(160, 25%, 15%)' },
  { name: 'Rosa Romântico', primary: 'hsl(350, 45%, 65%)', secondary: 'hsl(350, 45%, 95%)', text: 'hsl(350, 35%, 25%)' },
  { name: 'Azul Elegante', primary: 'hsl(210, 55%, 55%)', secondary: 'hsl(210, 45%, 98%)', text: 'hsl(210, 35%, 25%)' },
  { name: 'Ouro Real', primary: 'hsl(45, 90%, 55%)', secondary: 'hsl(45, 45%, 98%)', text: 'hsl(45, 35%, 25%)' },
  { name: 'Lavanda Suave', primary: 'hsl(270, 45%, 65%)', secondary: 'hsl(270, 25%, 98%)', text: 'hsl(270, 35%, 25%)' },
  { name: 'Verde Eucalipto', primary: 'hsl(150, 25%, 55%)', secondary: 'hsl(150, 15%, 98%)', text: 'hsl(150, 35%, 25%)' }
];

const decorativeElements = [
  { type: 'coracao' as const, icon: Heart, name: 'Coração' },
  { type: 'flor' as const, icon: Flower, name: 'Flor' },
  { type: 'texto' as const, icon: Sparkles, name: 'Texto Decorativo' }
];

const aspectRatioOptions = [
  { value: 'square', label: 'Quadrado (1:1)' },
  { value: 'portrait', label: 'Retrato (4:5)' },
  { value: 'landscape', label: 'Paisagem (16:9)' },
  { value: 'custom', label: 'Personalizado' }
];

const backgroundFitOptions = [
  { value: 'crop', label: 'Cortar' },
  { value: 'stretch', label: 'Esticar' },
  { value: 'tile', label: 'Repetir' },
  { value: 'fit', label: 'Ajustar' }
];

// By default, the customization step should not inject text elements for
// header/names/message because those core details come from the Basic Data.
// Leave the list empty so users can add only additional custom texts.
const defaultTextElements: ElementoTexto[] = [];

const defaultCanvasSettings: CanvasSettings = {
  aspectRatio: 'portrait',
  width: 400,
  height: 500,
  backgroundFit: 'crop',
  gridEnabled: false,
  snapToGrid: false,
  gridSize: 20
};

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({
  casal,
  design,
  onDesignChange,
  onNext,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('cores');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  // Edit mode is always enabled; we removed the toggle
  const [backgroundCategory, setBackgroundCategory] = useState<string>('all');

  // Load Google Fonts on component mount
  useEffect(() => {
    loadGoogleFonts();
  }, []);

  // Initialize canvas defaults and keep any existing custom texts without
  // introducing duplicated core text layers.
  useEffect(() => {
    if (!design.canvasSettings) {
      onDesignChange({
        ...design,
        canvasSettings: defaultCanvasSettings,
        elementosTexto: design.elementosTexto || defaultTextElements
      });
    }
  }, []);

  const handleColorPaletteSelect = (palette: typeof colorPalettes[0]) => {
    onDesignChange({
      ...design,
      corPrimaria: palette.primary,
      corSecundaria: palette.secondary,
      corTexto: palette.text
    });
  };

  const handleCustomColorChange = (colorType: 'corPrimaria' | 'corSecundaria' | 'corTexto', value: string) => {
    onDesignChange({
      ...design,
      [colorType]: value
    });
  };

  const handleOpacityChange = (value: number[]) => {
    onDesignChange({
      ...design,
      fundoOpacidade: value[0]
    });
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundImage(result);
        onDesignChange({
          ...design,
          fundoImagem: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundSelect = (backgroundId: string) => {
    const background = backgroundOptions.find(bg => bg.id === backgroundId);
    if (background) {
      onDesignChange({
        ...design,
        fundoImagem: background.url
      });
    }
  };

  const handleCanvasSettingsChange = (settings: Partial<CanvasSettings>) => {
    onDesignChange({
      ...design,
      canvasSettings: {
        ...design.canvasSettings,
        ...settings
      }
    });
  };

  const addDecorativeElement = (type: ElementoDesign['tipo']) => {
    const newElement: ElementoDesign = {
      id: `element-${Date.now()}`,
      tipo: type,
      posicao: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
      tamanho: 24,
      cor: design.corPrimaria || 'hsl(142, 35%, 45%)',
      rotacao: 0,
      editavel: true,
      visivel: true
    };

    const currentElements = design.elementos || [];
    if (currentElements.length >= 10) {
      alert('Máximo de 10 elementos decorativos atingido');
      return;
    }

    onDesignChange({
      ...design,
      elementos: [...currentElements, newElement]
    });
  };

  const addTextElement = () => {
    const newTextElement: ElementoTexto = {
      id: `text-${Date.now()}`,
      tipo: 'personalizado',
      texto: 'Novo texto',
      posicao: { x: 50, y: 50 },
      tamanho: { width: 200, height: 50 },
      fonte: {
        familia: 'Montserrat',
        tamanho: 16,
        peso: 'normal',
        estilo: 'normal',
        cor: design.corTexto || 'hsl(160, 25%, 15%)',
        alinhamento: 'center'
      },
      editavel: true,
      visivel: true
    };

    const currentTextElements = design.elementosTexto || [];
    onDesignChange({
      ...design,
      elementosTexto: [...currentTextElements, newTextElement]
    });
  };

  const updateTextElement = (elementId: string, updates: Partial<ElementoTexto>) => {
    const currentTextElements = design.elementosTexto || [];
    const updatedElements = currentTextElements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    
    onDesignChange({
      ...design,
      elementosTexto: updatedElements
    });
  };

  const removeTextElement = (elementId: string) => {
    const currentTextElements = design.elementosTexto || [];
    const updatedElements = currentTextElements.filter(el => el.id !== elementId);
    
    onDesignChange({
      ...design,
      elementosTexto: updatedElements
    });
  };

  

  const filteredBackgrounds = backgroundCategory === 'all' 
    ? backgroundOptions 
    : getBackgroundsByCategory(backgroundCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Visualização</h3>
        </div>
        
        <InvitationPreview
          casal={casal}
          design={design}
          onDesignChange={onDesignChange}
          editMode={true}
          className="w-full"
        />
      </div>

      {/* Customization Panel */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-xl font-heading text-primary flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Personalização Avançada</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full overflow-x-auto whitespace-nowrap gap-2 px-1">
              <TabsTrigger value="cores" className="min-w-max">Cores</TabsTrigger>
              <TabsTrigger value="fundo" className="min-w-max">Fundo</TabsTrigger>
              <TabsTrigger value="textos" className="min-w-max">Textos</TabsTrigger>
              <TabsTrigger value="elementos" className="min-w-max">Elementos</TabsTrigger>
              <TabsTrigger value="decoracoes" className="min-w-max">Decorações</TabsTrigger>
              <TabsTrigger value="canvas" className="min-w-max">Canvas</TabsTrigger>
            </TabsList>

            <TabsContent value="cores" className="space-y-6 mt-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Paletas Predefinidas</Label>
                <div className="grid grid-cols-2 gap-3">
                  {colorPalettes.map((palette) => (
                    <div
                      key={palette.name}
                      onClick={() => handleColorPaletteSelect(palette)}
                      className={cn(
                        "cursor-pointer p-3 rounded-lg border transition-all hover:shadow-md",
                        design.corPrimaria === palette.primary 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="w-5 h-5 rounded-full border border-border"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-border"
                          style={{ backgroundColor: palette.secondary }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-border"
                          style={{ backgroundColor: palette.text }}
                        />
                      </div>
                      <p className="text-xs font-medium">{palette.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Cores Personalizadas</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label className="w-24 text-xs">Primária:</Label>
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                        style={{ backgroundColor: design.corPrimaria || 'hsl(142, 35%, 45%)' }}
                        onClick={() => document.getElementById('primary-color')?.click()}
                      />
                      <Input
                        id="primary-color"
                        type="color"
                        value={design.corPrimaria?.includes('hsl') ? '#6B8E5A' : design.corPrimaria || '#6B8E5A'}
                        onChange={(e) => handleCustomColorChange('corPrimaria', e.target.value)}
                        className="sr-only"
                      />
                      <Input
                        value={design.corPrimaria || 'hsl(142, 35%, 45%)'}
                        onChange={(e) => handleCustomColorChange('corPrimaria', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="hsl(142, 35%, 45%)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label className="w-24 text-xs">Secundária:</Label>
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                        style={{ backgroundColor: design.corSecundaria || 'hsl(30, 54%, 98%)' }}
                        onClick={() => document.getElementById('secondary-color')?.click()}
                      />
                      <Input
                        id="secondary-color"
                        type="color"
                        value={design.corSecundaria?.includes('hsl') ? '#FDF8F2' : design.corSecundaria || '#FDF8F2'}
                        onChange={(e) => handleCustomColorChange('corSecundaria', e.target.value)}
                        className="sr-only"
                      />
                      <Input
                        value={design.corSecundaria || 'hsl(30, 54%, 98%)'}
                        onChange={(e) => handleCustomColorChange('corSecundaria', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="hsl(30, 54%, 98%)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label className="w-24 text-xs">Texto:</Label>
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                        style={{ backgroundColor: design.corTexto || 'hsl(160, 25%, 15%)' }}
                        onClick={() => document.getElementById('text-color')?.click()}
                      />
                      <Input
                        id="text-color"
                        type="color"
                        value={design.corTexto?.includes('hsl') ? '#2D5A3D' : design.corTexto || '#2D5A3D'}
                        onChange={(e) => handleCustomColorChange('corTexto', e.target.value)}
                        className="sr-only"
                      />
                      <Input
                        value={design.corTexto || 'hsl(160, 25%, 15%)'}
                        onChange={(e) => handleCustomColorChange('corTexto', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="hsl(160, 25%, 15%)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fundo" className="space-y-6 mt-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Galeria de Fundos</Label>
                <Select value={backgroundCategory} onValueChange={setBackgroundCategory}>
                  <SelectTrigger className="mb-3">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="floral">Floral</SelectItem>
                    <SelectItem value="hearts">Corações</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="abstract">Abstrato</SelectItem>
                    <SelectItem value="nature">Natureza</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {filteredBackgrounds.map((background) => (
                    <div
                      key={background.id}
                      onClick={() => handleBackgroundSelect(background.id)}
                      className={cn(
                        "cursor-pointer p-2 rounded-lg border transition-all hover:shadow-md",
                        design.fundoImagem === background.url 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <img
                        src={background.thumbnail}
                        alt={background.name}
                        className="w-full h-20 object-cover rounded mb-2"
                      />
                      <p className="text-xs font-medium">{background.name}</p>
                      <p className="text-xs text-muted-foreground">{background.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Upload de Imagem</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Adicione uma foto de fundo personalizada
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="w-full"
                  />
                </div>
                
                {(design.fundoImagem || backgroundImage) && (
                  <div className="mt-4">
                    <img
                      src={design.fundoImagem || backgroundImage || ''}
                      alt="Background preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Opacidade da Imagem: {design.fundoOpacidade || 20}%
                </Label>
                <Slider
                  value={[design.fundoOpacidade || 20]}
                  onValueChange={handleOpacityChange}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="decoracoes" className="space-y-6 mt-6">
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Elementos Decorativos do Cabeçalho</Label>
                  <div className="flex items-center space-x-2">
                    <Label className="text-xs">Mostrar</Label>
                    <Switch
                      checked={design.decoracaoCabecalho?.habilitado ?? true}
                      onCheckedChange={(checked) => onDesignChange({
                        ...design,
                        decoracaoCabecalho: {
                          habilitado: checked,
                          tipo: design.decoracaoCabecalho?.tipo || 'coracao',
                          cor: design.decoracaoCabecalho?.cor || (design.corPrimaria || '#4B9B68'),
                          tamanho: design.decoracaoCabecalho?.tamanho || 20,
                          espacamento: design.decoracaoCabecalho?.espacamento || 8,
                          deslocamentoX: design.decoracaoCabecalho?.deslocamentoX || 0,
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'coracao', label: 'Corações', icon: Heart },
                    { value: 'estrela', label: 'Estrelas', icon: Star },
                    { value: 'flor', label: 'Flores', icon: Flower },
                    { value: 'cruz', label: 'Cruz', icon: Cross },
                    { value: 'lacinho', label: 'Lacinho', icon: Ribbon },
                  ].map((opt) => (
                    <Button
                      key={opt.value}
                      type="button"
                      variant={(design.decoracaoCabecalho?.tipo || 'coracao') === (opt.value as any) ? 'default' : 'outline'}
                      onClick={() => onDesignChange({
                        ...design,
                        decoracaoCabecalho: {
                          habilitado: design.decoracaoCabecalho?.habilitado ?? true,
                          tipo: opt.value as any,
                          cor: design.decoracaoCabecalho?.cor || (design.corPrimaria || '#4B9B68'),
                          tamanho: design.decoracaoCabecalho?.tamanho || 20,
                          espacamento: design.decoracaoCabecalho?.espacamento || 8,
                          deslocamentoX: design.decoracaoCabecalho?.deslocamentoX || 0,
                        }
                      })}
                      className="h-16 flex-col"
                    >
                      <opt.icon className="w-5 h-5" />
                      <span className="text-xs">{opt.label}</span>
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Label className="w-24 text-xs">Cor</Label>
                    <div
                      className="w-8 h-8 rounded border border-border cursor-pointer"
                      style={{ backgroundColor: design.decoracaoCabecalho?.cor || design.corPrimaria || '#4B9B68' }}
                      onClick={() => document.getElementById('decoracao-cor')?.click()}
                    />
                    <Input
                      id="decoracao-cor"
                      type="color"
                      value={(design.decoracaoCabecalho?.cor || design.corPrimaria || '#4B9B68') as string}
                      onChange={(e) => onDesignChange({
                        ...design,
                        decoracaoCabecalho: {
                          habilitado: design.decoracaoCabecalho?.habilitado ?? true,
                          tipo: design.decoracaoCabecalho?.tipo || 'coracao',
                          cor: e.target.value,
                          tamanho: design.decoracaoCabecalho?.tamanho || 20,
                          espacamento: design.decoracaoCabecalho?.espacamento || 8,
                          deslocamentoX: design.decoracaoCabecalho?.deslocamentoX || 0,
                        }
                      })}
                      className="sr-only"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label className="w-24 text-xs">Tamanho</Label>
                    <Slider
                      value={[design.decoracaoCabecalho?.tamanho || 20]}
                      onValueChange={(v) => onDesignChange({
                        ...design,
                        decoracaoCabecalho: {
                          habilitado: design.decoracaoCabecalho?.habilitado ?? true,
                          tipo: design.decoracaoCabecalho?.tipo || 'coracao',
                          cor: design.decoracaoCabecalho?.cor || design.corPrimaria || '#4B9B68',
                          tamanho: v[0],
                          espacamento: design.decoracaoCabecalho?.espacamento || 8,
                          deslocamentoX: design.decoracaoCabecalho?.deslocamentoX || 0,
                        }
                      })}
                      min={10}
                      max={48}
                      step={1}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label className="w-24 text-xs">Espaçamento</Label>
                    <Slider
                      value={[design.decoracaoCabecalho?.espacamento || 8]}
                      onValueChange={(v) => onDesignChange({
                        ...design,
                        decoracaoCabecalho: {
                          habilitado: design.decoracaoCabecalho?.habilitado ?? true,
                          tipo: design.decoracaoCabecalho?.tipo || 'coracao',
                          cor: design.decoracaoCabecalho?.cor || design.corPrimaria || '#4B9B68',
                          tamanho: design.decoracaoCabecalho?.tamanho || 20,
                          espacamento: v[0],
                          deslocamentoX: design.decoracaoCabecalho?.deslocamentoX || 0,
                        }
                      })}
                      min={0}
                      max={32}
                      step={1}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Label className="w-24 text-xs">Deslocamento X</Label>
                    <Slider
                      value={[design.decoracaoCabecalho?.deslocamentoX || 0]}
                      onValueChange={(v) => onDesignChange({
                        ...design,
                        decoracaoCabecalho: {
                          habilitado: design.decoracaoCabecalho?.habilitado ?? true,
                          tipo: design.decoracaoCabecalho?.tipo || 'coracao',
                          cor: design.decoracaoCabecalho?.cor || design.corPrimaria || '#4B9B68',
                          tamanho: design.decoracaoCabecalho?.tamanho || 20,
                          espacamento: design.decoracaoCabecalho?.espacamento || 8,
                          deslocamentoX: v[0],
                        }
                      })}
                      min={-50}
                      max={50}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDesignChange({
                      ...design,
                      decoracaoCabecalho: {
                        habilitado: true,
                        tipo: 'coracao',
                        cor: '#4B9B68',
                        tamanho: 20,
                        espacamento: 8,
                        deslocamentoX: 0,
                      }
                    })}
                  >
                    Resetar para padrão
                  </Button>
                </div>
              </div>

              {/* Middle Decoration */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Decoração Central</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label className="text-xs">Mostrar</Label>
                      <Switch
                        checked={design.decoracaoCentral?.habilitado ?? true}
                        onCheckedChange={(checked) => onDesignChange({
                          ...design,
                          decoracaoCentral: {
                            habilitado: checked,
                            sincronizarComLaterais: design.decoracaoCentral?.sincronizarComLaterais ?? true,
                            tipo: design.decoracaoCentral?.tipo,
                            cor: design.decoracaoCentral?.cor,
                            tamanho: design.decoracaoCentral?.tamanho,
                            linhasVisiveis: design.decoracaoCentral?.linhasVisiveis ?? true,
                            linhasComprimento: design.decoracaoCentral?.linhasComprimento || 'medio',
                            deslocamentoX: design.decoracaoCentral?.deslocamentoX || 0,
                            deslocamentoY: design.decoracaoCentral?.deslocamentoY || 0,
                          }
                        })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-xs">Sincronizar com laterais</Label>
                      <Switch
                        checked={design.decoracaoCentral?.sincronizarComLaterais ?? true}
                        onCheckedChange={(checked) => onDesignChange({
                          ...design,
                          decoracaoCentral: {
                            habilitado: design.decoracaoCentral?.habilitado ?? true,
                            sincronizarComLaterais: checked,
                            tipo: design.decoracaoCentral?.tipo,
                            cor: design.decoracaoCentral?.cor,
                            tamanho: design.decoracaoCentral?.tamanho,
                            linhasVisiveis: design.decoracaoCentral?.linhasVisiveis ?? true,
                            linhasComprimento: design.decoracaoCentral?.linhasComprimento || 'medio',
                            deslocamentoX: design.decoracaoCentral?.deslocamentoX || 0,
                            deslocamentoY: design.decoracaoCentral?.deslocamentoY || 0,
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Independent controls when not synced */}
                {!(design.decoracaoCentral?.sincronizarComLaterais ?? true) && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { value: 'coracao', label: 'Coração', icon: Heart },
                        { value: 'estrela', label: 'Estrela', icon: Star },
                        { value: 'flor', label: 'Flor', icon: Flower },
                        { value: 'cruz', label: 'Cruz', icon: Cross },
                        { value: 'lacinho', label: 'Lacinho', icon: Ribbon },
                      ].map((opt) => (
                        <Button
                          key={opt.value}
                          type="button"
                          variant={(design.decoracaoCentral?.tipo || 'coracao') === (opt.value as any) ? 'default' : 'outline'}
                          onClick={() => onDesignChange({
                            ...design,
                            decoracaoCentral: {
                              ...(design.decoracaoCentral || {
                                habilitado: true,
                                sincronizarComLaterais: false,
                                linhasVisiveis: true,
                                linhasComprimento: 'medio',
                                deslocamentoX: 0,
                                deslocamentoY: 0,
                              }),
                              tipo: opt.value as any,
                            }
                          })}
                          className="h-16 flex-col"
                        >
                          <opt.icon className="w-5 h-5" />
                          <span className="text-xs">{opt.label}</span>
                        </Button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Label className="w-24 text-xs">Cor</Label>
                        <div
                          className="w-8 h-8 rounded border border-border cursor-pointer"
                          style={{ backgroundColor: design.decoracaoCentral?.cor || design.corPrimaria || '#4B9B68' }}
                          onClick={() => document.getElementById('decoracao-central-cor')?.click()}
                        />
                        <Input
                          id="decoracao-central-cor"
                          type="color"
                          value={(design.decoracaoCentral?.cor || design.corPrimaria || '#4B9B68') as string}
                          onChange={(e) => onDesignChange({
                            ...design,
                            decoracaoCentral: {
                              ...(design.decoracaoCentral || {
                                habilitado: true,
                                sincronizarComLaterais: false,
                                linhasVisiveis: true,
                                linhasComprimento: 'medio',
                                deslocamentoX: 0,
                                deslocamentoY: 0,
                              }),
                              cor: e.target.value,
                            }
                          })}
                          className="sr-only"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <Label className="w-24 text-xs">Tamanho</Label>
                        <Select
                          value={String(design.decoracaoCentral?.tamanho || '24')}
                          onValueChange={(v) => onDesignChange({
                            ...design,
                            decoracaoCentral: {
                              ...(design.decoracaoCentral || {
                                habilitado: true,
                                sincronizarComLaterais: false,
                                linhasVisiveis: true,
                                linhasComprimento: 'medio',
                                deslocamentoX: 0,
                                deslocamentoY: 0,
                              }),
                              tamanho: parseInt(v),
                            }
                          })}
                        >
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="18">Pequeno</SelectItem>
                            <SelectItem value="24">Médio</SelectItem>
                            <SelectItem value="32">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Label className="w-24 text-xs">Linhas</Label>
                        <Switch
                          checked={design.decoracaoCentral?.linhasVisiveis ?? true}
                          onCheckedChange={(checked) => onDesignChange({
                            ...design,
                            decoracaoCentral: {
                              ...(design.decoracaoCentral || {
                                habilitado: true,
                                sincronizarComLaterais: false,
                                linhasComprimento: 'medio',
                                deslocamentoX: 0,
                                deslocamentoY: 0,
                              }),
                              linhasVisiveis: checked,
                            }
                          })}
                        />
                        <Select
                          value={design.decoracaoCentral?.linhasComprimento || 'medio'}
                          onValueChange={(v) => onDesignChange({
                            ...design,
                            decoracaoCentral: {
                              ...(design.decoracaoCentral || {
                                habilitado: true,
                                sincronizarComLaterais: false,
                                linhasVisiveis: true,
                                deslocamentoX: 0,
                                deslocamentoY: 0,
                              }),
                              linhasComprimento: v as any,
                            }
                          })}
                        >
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="curto">Curto</SelectItem>
                            <SelectItem value="medio">Médio</SelectItem>
                            <SelectItem value="longo">Longo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Label className="w-24 text-xs">Posição X</Label>
                        <Slider
                          value={[design.decoracaoCentral?.deslocamentoX || 0]}
                          onValueChange={(v) => onDesignChange({
                            ...design,
                            decoracaoCentral: {
                              ...(design.decoracaoCentral || {
                                habilitado: true,
                                sincronizarComLaterais: false,
                                linhasVisiveis: true,
                                linhasComprimento: 'medio',
                                deslocamentoY: 0,
                              }),
                              deslocamentoX: v[0],
                            }
                          })}
                          min={-50}
                          max={50}
                          step={1}
                          className="flex-1"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <Label className="w-24 text-xs">Posição Y</Label>
                        <Slider
                          value={[design.decoracaoCentral?.deslocamentoY || 0]}
                          onValueChange={(v) => onDesignChange({
                            ...design,
                            decoracaoCentral: {
                              ...(design.decoracaoCentral || {
                                habilitado: true,
                                sincronizarComLaterais: false,
                                linhasVisiveis: true,
                                linhasComprimento: 'medio',
                                deslocamentoX: 0,
                              }),
                              deslocamentoY: v[0],
                            }
                          })}
                          min={-30}
                          max={30}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDesignChange({
                          ...design,
                          decoracaoCentral: {
                            habilitado: true,
                            sincronizarComLaterais: true,
                            tipo: undefined,
                            cor: undefined,
                            tamanho: undefined,
                            linhasVisiveis: true,
                            linhasComprimento: 'medio',
                            deslocamentoX: 0,
                            deslocamentoY: 0,
                          }
                        })}
                      >
                        Resetar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="textos" className="space-y-6 mt-6">
              {/* Core text styling controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Título "Convite de Casamento" */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="text-sm font-medium">Título do Convite</Label>
                  <Input
                    value={design.tituloConviteTexto || 'CONVITE DE CASAMENTO'}
                    onChange={(e) => onDesignChange({ ...design, tituloConviteTexto: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Fonte</Label>
                      <Select
                        value={design.estiloTitulo?.familia || 'Great Vibes'}
                        onValueChange={(value) => onDesignChange({
                          ...design,
                          estiloTitulo: { ...(design.estiloTitulo || { tamanho: 14, peso: 'normal', estilo: 'normal', cor: design.corPrimaria || '#000' }), familia: value }
                        })}
                      >
                        <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: getFontFamily(font.value) }}>{font.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Tamanho</Label>
                      <Slider
                        value={[design.estiloTitulo?.tamanho || 14]}
                        onValueChange={(v) => onDesignChange({
                          ...design,
                          estiloTitulo: { ...(design.estiloTitulo || { familia: 'Great Vibes', peso: 'normal', estilo: 'normal', cor: design.corPrimaria || '#000' }), tamanho: v[0] }
                        })}
                        min={10}
                        max={48}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Cor</Label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border border-border cursor-pointer"
                          style={{ backgroundColor: design.tituloConviteCor || design.corPrimaria || '#000' }}
                          onClick={() => document.getElementById('titulo-cor')?.click()}
                        />
                        <Input id="titulo-cor" type="color" className="sr-only" value={design.tituloConviteCor || design.corPrimaria || '#000'} onChange={(e) => onDesignChange({ ...design, tituloConviteCor: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => onDesignChange({ ...design, estiloTitulo: undefined, tituloConviteTexto: undefined, tituloConviteCor: undefined })}>Resetar</Button>
                  </div>
                </div>

                {/* Nomes do casal */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="text-sm font-medium">Nomes do Casal</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Fonte</Label>
                      <Select
                        value={design.estiloNomes?.familia || 'Playfair Display'}
                        onValueChange={(value) => onDesignChange({
                          ...design,
                          estiloNomes: { ...(design.estiloNomes || { tamanho: 30, peso: 'bold', estilo: 'normal', cor: design.corTexto || '#000', alinhamento: 'center' }), familia: value }
                        })}
                      >
                        <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: getFontFamily(font.value) }}>{font.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Tamanho</Label>
                      <Slider
                        value={[design.estiloNomes?.tamanho || 30]}
                        onValueChange={(v) => onDesignChange({
                          ...design,
                          estiloNomes: { ...(design.estiloNomes || { familia: 'Playfair Display', peso: 'bold', estilo: 'normal', cor: design.corTexto || '#000', alinhamento: 'center' }), tamanho: v[0] }
                        })}
                        min={20}
                        max={64}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Alinhamento</Label>
                      <Select
                        value={design.estiloNomes?.alinhamento || 'center'}
                        onValueChange={(value) => onDesignChange({
                          ...design,
                          estiloNomes: { ...(design.estiloNomes || { familia: 'Playfair Display', tamanho: 30, peso: 'bold', estilo: 'normal', cor: design.corTexto || '#000' }), alinhamento: value as any }
                        })}
                      >
                        <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Esquerda</SelectItem>
                          <SelectItem value="center">Centro</SelectItem>
                          <SelectItem value="right">Direita</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Cor</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border border-border cursor-pointer" style={{ backgroundColor: design.estiloNomes?.cor || design.corTexto || '#000' }} onClick={() => document.getElementById('nomes-cor')?.click()} />
                        <Input id="nomes-cor" type="color" className="sr-only" value={design.estiloNomes?.cor || design.corTexto || '#000'} onChange={(e) => onDesignChange({ ...design, estiloNomes: { ...(design.estiloNomes || {} as any), cor: e.target.value } })} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => onDesignChange({ ...design, estiloNomes: undefined })}>Resetar</Button>
                  </div>
                </div>

                {/* Detalhes (data e local) */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="text-sm font-medium">Detalhes (Data e Local)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Fonte</Label>
                      <Select
                        value={design.estiloDetalhes?.familia || 'Montserrat'}
                        onValueChange={(value) => onDesignChange({
                          ...design,
                          estiloDetalhes: { ...(design.estiloDetalhes || { tamanho: 14, peso: 'normal', estilo: 'normal', cor: '#6B7280' }), familia: value }
                        })}
                      >
                        <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: getFontFamily(font.value) }}>{font.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Tamanho</Label>
                      <Slider
                        value={[design.estiloDetalhes?.tamanho || 14]}
                        onValueChange={(v) => onDesignChange({
                          ...design,
                          estiloDetalhes: { ...(design.estiloDetalhes || { familia: 'Montserrat', peso: 'normal', estilo: 'normal', cor: '#6B7280' }), tamanho: v[0] }
                        })}
                        min={10}
                        max={24}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Cor</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border border-border cursor-pointer" style={{ backgroundColor: design.estiloDetalhes?.cor || '#6B7280' }} onClick={() => document.getElementById('detalhes-cor')?.click()} />
                        <Input id="detalhes-cor" type="color" className="sr-only" value={design.estiloDetalhes?.cor || '#6B7280'} onChange={(e) => onDesignChange({ ...design, estiloDetalhes: { ...(design.estiloDetalhes || {} as any), cor: e.target.value } })} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => onDesignChange({ ...design, estiloDetalhes: undefined })}>Resetar</Button>
                  </div>
                </div>

                {/* Mensagem personalizada */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="text-sm font-medium">Mensagem</Label>
                  <Textarea
                    value={design.mensagemPersonalizada || 'O amor é a ponte entre duas almas'}
                    onChange={(e) => onDesignChange({ ...design, mensagemPersonalizada: e.target.value })}
                    className="min-h-[80px]"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Fonte</Label>
                      <Select
                        value={design.estiloMensagem?.familia || 'Dancing Script'}
                        onValueChange={(value) => onDesignChange({
                          ...design,
                          estiloMensagem: { ...(design.estiloMensagem || { tamanho: 16, peso: 'normal', estilo: 'italic', cor: design.corTexto || '#000' }), familia: value }
                        })}
                      >
                        <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: getFontFamily(font.value) }}>{font.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Tamanho</Label>
                      <Slider
                        value={[design.estiloMensagem?.tamanho || 16]}
                        onValueChange={(v) => onDesignChange({
                          ...design,
                          estiloMensagem: { ...(design.estiloMensagem || { familia: 'Dancing Script', peso: 'normal', estilo: 'italic', cor: design.corTexto || '#000' }), tamanho: v[0] }
                        })}
                        min={12}
                        max={28}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Cor</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border border-border cursor-pointer" style={{ backgroundColor: design.estiloMensagem?.cor || design.corTexto || '#000' }} onClick={() => document.getElementById('mensagem-cor')?.click()} />
                        <Input id="mensagem-cor" type="color" className="sr-only" value={design.estiloMensagem?.cor || design.corTexto || '#000'} onChange={(e) => onDesignChange({ ...design, estiloMensagem: { ...(design.estiloMensagem || {} as any), cor: e.target.value } })} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => onDesignChange({ ...design, estiloMensagem: undefined })}>Resetar</Button>
                  </div>
                </div>

                {/* Rodapé */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="text-sm font-medium">Rodapé</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Fonte</Label>
                      <Select
                        value={design.estiloRodape?.familia || 'Montserrat'}
                        onValueChange={(value) => onDesignChange({
                          ...design,
                          estiloRodape: { ...(design.estiloRodape || { tamanho: 12, peso: 'normal', estilo: 'normal', cor: '#6B7280' }), familia: value }
                        })}
                      >
                        <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: getFontFamily(font.value) }}>{font.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Tamanho</Label>
                      <Slider
                        value={[design.estiloRodape?.tamanho || 12]}
                        onValueChange={(v) => onDesignChange({
                          ...design,
                          estiloRodape: { ...(design.estiloRodape || { familia: 'Montserrat', peso: 'normal', estilo: 'normal', cor: '#6B7280' }), tamanho: v[0] }
                        })}
                        min={10}
                        max={20}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Cor</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded border border-border cursor-pointer" style={{ backgroundColor: design.estiloRodape?.cor || '#6B7280' }} onClick={() => document.getElementById('rodape-cor')?.click()} />
                        <Input id="rodape-cor" type="color" className="sr-only" value={design.estiloRodape?.cor || '#6B7280'} onChange={(e) => onDesignChange({ ...design, estiloRodape: { ...(design.estiloRodape || {} as any), cor: e.target.value } })} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => onDesignChange({ ...design, estiloRodape: undefined })}>Resetar</Button>
                  </div>
                </div>
              </div>

              {/* Additional custom texts created by the user */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Elementos de Texto Personalizados</Label>
                <Button size="sm" onClick={addTextElement}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Texto
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {(design.elementosTexto || []).map((elemento) => (
                  <div key={elemento.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{elemento.tipo}</Label>
                      <Button size="sm" variant="ghost" onClick={() => removeTextElement(elemento.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Textarea value={elemento.texto} onChange={(e) => updateTextElement(elemento.id, { texto: e.target.value })} placeholder="Digite o texto..." className="text-sm" />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Fonte</Label>
                        <Select value={elemento.fonte.familia} onValueChange={(value) => updateTextElement(elemento.id, { fonte: { ...elemento.fonte, familia: value } })}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                <span style={{ fontFamily: getFontFamily(font.value) }}>{font.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Tamanho: {elemento.fonte.tamanho}px</Label>
                        <Slider value={[elemento.fonte.tamanho]} onValueChange={(value) => updateTextElement(elemento.id, { fonte: { ...elemento.fonte, tamanho: value[0] } })} min={10} max={100} step={1} className="w-full" />
                      </div>
                      <div>
                        <Label className="text-xs">Peso</Label>
                        <Select value={elemento.fonte.peso} onValueChange={(value) => updateTextElement(elemento.id, { fonte: { ...elemento.fonte, peso: value as any } })}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Estilo</Label>
                        <Select value={elemento.fonte.estilo} onValueChange={(value) => updateTextElement(elemento.id, { fonte: { ...elemento.fonte, estilo: value as any } })}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="italic">Italic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Alinhamento</Label>
                        <Select value={elemento.fonte.alinhamento || 'center'} onValueChange={(value) => updateTextElement(elemento.id, { fonte: { ...elemento.fonte, alinhamento: value as any } })}>
                          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Esquerda</SelectItem>
                            <SelectItem value="center">Centro</SelectItem>
                            <SelectItem value="right">Direita</SelectItem>
                            <SelectItem value="justify">Justificado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Cor</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-6 h-6 rounded border border-border cursor-pointer" style={{ backgroundColor: elemento.fonte.cor }} onClick={() => document.getElementById(`color-${elemento.id}`)?.click()} />
                          <Input id={`color-${elemento.id}`} type="color" value={elemento.fonte.cor} onChange={(e) => updateTextElement(elemento.id, { fonte: { ...elemento.fonte, cor: e.target.value } })} className="sr-only" />
                          <Input value={elemento.fonte.cor} onChange={(e) => updateTextElement(elemento.id, { fonte: { ...elemento.fonte, cor: e.target.value } })} className="flex-1 text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs text-muted-foreground mt-2">Dica: use "Resetar" em cada bloco para voltar ao padrão.</p>
              </div>
            </TabsContent>

            <TabsContent value="elementos" className="space-y-6 mt-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Elementos Decorativos</Label>
                <div className="grid grid-cols-3 gap-3">
                  {decorativeElements.map((element) => (
                    <Button
                      key={element.type}
                      variant="outline"
                      onClick={() => addDecorativeElement(element.type)}
                      className="h-20 flex-col space-y-2"
                      disabled={(design.elementos?.length || 0) >= 10}
                    >
                      <element.icon className="w-6 h-6" />
                      <span className="text-xs">{element.name}</span>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Máximo de 10 elementos. Clique nos elementos no preview para editá-los.
                </p>
              </div>

              {design.elementos && design.elementos.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium mb-3 block">Elementos Adicionados: {design.elementos.filter(el => el.visivel).length}/10</Label>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {design.elementos.map((el) => (
                      <div key={el.id} className="border rounded-lg p-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                        <span className="text-xs capitalize">{el.tipo}</span>
                        <div className="flex items-center space-x-2">
                          <Label className="text-xs">Cor</Label>
                          <div className="w-5 h-5 rounded border border-border cursor-pointer" style={{ backgroundColor: el.cor }} onClick={() => document.getElementById(`el-color-${el.id}`)?.click()} />
                          <Input id={`el-color-${el.id}`} type="color" className="sr-only" value={el.cor} onChange={(e) => onDesignChange({ ...design, elementos: (design.elementos || []).map(x => x.id === el.id ? { ...x, cor: e.target.value } : x) })} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="text-xs">Tam</Label>
                          <Slider value={[el.tamanho]} onValueChange={(v) => onDesignChange({ ...design, elementos: (design.elementos || []).map(x => x.id === el.id ? { ...x, tamanho: v[0] } : x) })} min={8} max={64} step={1} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="text-xs">X</Label>
                          <Slider value={[el.posicao.x]} onValueChange={(v) => onDesignChange({ ...design, elementos: (design.elementos || []).map(x => x.id === el.id ? { ...x, posicao: { ...x.posicao, x: v[0] } } : x) })} min={0} max={100} step={1} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label className="text-xs">Y</Label>
                          <Slider value={[el.posicao.y]} onValueChange={(v) => onDesignChange({ ...design, elementos: (design.elementos || []).map(x => x.id === el.id ? { ...x, posicao: { ...x.posicao, y: v[0] } } : x) })} min={0} max={100} step={1} />
                        </div>
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDesignChange({
                              ...design,
                              elementos: (design.elementos || []).filter(x => x.id !== el.id)
                            })}
                            aria-label="Remover elemento"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="canvas" className="space-y-6 mt-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Configurações do Canvas</Label>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs">Proporção</Label>
                    <Select
                      value={design.canvasSettings?.aspectRatio || 'portrait'}
                      onValueChange={(value) => handleCanvasSettingsChange({ aspectRatio: value as any })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatioOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Ajuste do Fundo</Label>
                    <Select
                      value={design.canvasSettings?.backgroundFit || 'crop'}
                      onValueChange={(value) => handleCanvasSettingsChange({ backgroundFit: value as any })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundFitOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="grid-enabled"
                      checked={design.canvasSettings?.gridEnabled || false}
                      onCheckedChange={(checked) => handleCanvasSettingsChange({ gridEnabled: checked })}
                    />
                    <Label htmlFor="grid-enabled" className="text-xs">Mostrar Grade</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Música tab removida para simplificar o painel */}
          </Tabs>

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onBack}>
              Voltar
            </Button>
            <Button onClick={onNext} className="bg-gradient-primary">
              Próximo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};