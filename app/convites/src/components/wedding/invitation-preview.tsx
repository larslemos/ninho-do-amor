import React, { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { CasalData, ConviteDesign, ElementoDesign, ElementoTexto, FonteTexto, CanvasSettings } from '@/types/wedding';
import { Heart, Calendar, MapPin, Flower, Sparkles, Edit3, X, RotateCw, Palette, Type, Move, Star, Cross, Ribbon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getFontFamily } from '@/data/fonts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface InvitationPreviewProps {
  casal: Partial<CasalData>;
  design?: Partial<ConviteDesign>;
  className?: string;
  onDesignChange?: (design: Partial<ConviteDesign>) => void;
  editMode?: boolean;
}

const fontWeights = [
  { value: 'light', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' }
];

const fontStyles = [
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' }
];

const alignments = [
  { value: 'left', label: 'Esquerda' },
  { value: 'center', label: 'Centro' },
  { value: 'right', label: 'Direita' },
  { value: 'justify', label: 'Justificado' }
];

export const InvitationPreview: React.FC<InvitationPreviewProps> = ({ 
  casal, 
  design = {},
  className,
  onDesignChange,
  editMode = false
}) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const [dragging, setDragging] = useState<{ id: string; type: 'design' | 'text' } | null>(null);
  // Disable inline editing for core text (header, names, message) to avoid
  // conflicts with Basic Data. We still keep selection for decorative items.
  const [editingText, setEditingText] = useState<string | null>(null);

  const {
    primeiroNome = 'Seu Nome',
    sobrenome = 'Sobrenome',
    parceiroPrimeiroNome = 'Nome do Parceiro',
    parceiroSobrenome = 'Sobrenome',
    dataCasamento,
    cidade = 'Sua Cidade',
    provincia = 'Província'
  } = casal;

  const {
    corPrimaria = 'hsl(142, 35%, 45%)',
    corSecundaria = 'hsl(30, 54%, 98%)',
    corTexto = 'hsl(160, 25%, 15%)',
    fundoOpacidade = 20,
    fundoImagem,
    elementos = [],
    elementosTexto = [],
    musicaUrl,
    mensagemPersonalizada = 'O amor é a ponte entre duas almas',
    canvasSettings,
    estiloTitulo,
    estiloNomes,
    estiloDetalhes,
    estiloMensagem,
    estiloRodape,
    tituloConviteTexto,
    tituloConviteCor,
    decoracaoCabecalho,
    decoracaoCentral
  } = design;

  const formatDate = (date?: Date) => {
    if (!date) return 'Data do Casamento';
    return date.toLocaleDateString('pt-MZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleElementClick = (elementId: string) => {
    if (!editMode) return;
    setSelectedElement(selectedElement === elementId ? null : elementId);
  };
  const updatePositionFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!dragging || !onDesignChange) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xPercent = ((clientX - rect.left) / rect.width) * 100;
    const yPercent = ((clientY - rect.top) / rect.height) * 100;
    if (dragging.type === 'design') {
      const updated = elementos.map((el) => el.id === dragging.id ? { ...el, posicao: { x: Math.max(0, Math.min(100, xPercent)), y: Math.max(0, Math.min(100, yPercent)) } } : el);
      onDesignChange({ ...design, elementos: updated });
    } else {
      const updated = elementosTexto.map((el) => el.id === dragging.id ? { ...el, posicao: { x: Math.max(0, Math.min(100, xPercent)), y: Math.max(0, Math.min(100, yPercent)) } } : el);
      onDesignChange({ ...design, elementosTexto: updated });
    }
  }, [dragging, onDesignChange, design, elementos, elementosTexto]);

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    e.preventDefault();
    updatePositionFromEvent(e.clientX, e.clientY);
  };

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = () => {
    setDragging(null);
  };

  const handleTextClick = (elementId: string) => {
    if (!editMode) return;
    // Prevent editing for reserved ids that mirror Basic Data
    const lockedIds = new Set(['header-title', 'names', 'message']);
    if (lockedIds.has(elementId)) return;
    setEditingText(elementId);
  };

  const updateElementoDesign = (elementId: string, updates: Partial<ElementoDesign>) => {
    if (!onDesignChange) return;
    
    const updatedElementos = elementos.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    
    onDesignChange({
      ...design,
      elementos: updatedElementos
    });
  };

  const updateElementoTexto = (elementId: string, updates: Partial<ElementoTexto>) => {
    if (!onDesignChange) return;
    
    const updatedElementosTexto = elementosTexto.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    
    onDesignChange({
      ...design,
      elementosTexto: updatedElementosTexto
    });
  };

  const renderDecorativeElement = (elemento: ElementoDesign, index: number) => {
    const IconComponent = elemento.tipo === 'coracao' ? Heart : 
                         elemento.tipo === 'flor' ? Flower : 
                         Sparkles;

    const isSelected = selectedElement === elemento.id;

    return (
      <div
        key={elemento.id}
        className={cn(
          "absolute cursor-pointer transition-all duration-200",
          isSelected && "ring-2 ring-blue-500 ring-offset-2"
        )}
        style={{
          left: `${elemento.posicao.x}%`,
          top: `${elemento.posicao.y}%`,
          transform: `rotate(${elemento.rotacao || 0}deg)`,
          color: elemento.cor
        }}
        onClick={() => handleElementClick(elemento.id)}
        onPointerDown={(e) => {
          if (!editMode) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging({ id: elemento.id, type: 'design' });
        }}
      >
        <IconComponent 
          size={elemento.tamanho} 
          className={elemento.tipo === 'coracao' ? 'fill-current' : ''} 
        />
        
        {isSelected && editMode && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-2 flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                const newRotation = (elemento.rotacao || 0) + 45;
                updateElementoDesign(elemento.id, { rotacao: newRotation });
              }}
            >
              <RotateCw className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                const newColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
                updateElementoDesign(elemento.id, { cor: newColor });
              }}
            >
              <Palette className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                updateElementoDesign(elemento.id, { visivel: false });
                setSelectedElement(null);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderTextElement = (elemento: ElementoTexto) => {
    // Skip rendering of reserved core text elements that are sourced from
    // Basic Data and already rendered separately below.
    if (['header-title', 'names', 'message'].includes(elemento.id)) {
      return null;
    }
    const isSelected = selectedElement === elemento.id;
    const isEditing = editingText === elemento.id;

    if (!elemento.visivel) return null;

    const fontStyle = {
      fontFamily: getFontFamily(elemento.fonte.familia),
      fontSize: `${elemento.fonte.tamanho}px`,
      fontWeight: elemento.fonte.peso,
      fontStyle: elemento.fonte.estilo,
      color: elemento.fonte.cor,
      textAlign: elemento.fonte.alinhamento || 'center',
      width: `${elemento.tamanho.width}px`,
      height: `${elemento.tamanho.height}px`
    };

    return (
      <div
        key={elemento.id}
        className={cn(
          "absolute cursor-pointer transition-all duration-200",
          isSelected && "ring-2 ring-blue-500 ring-offset-2"
        )}
        style={{
          left: `${elemento.posicao.x}%`,
          top: `${elemento.posicao.y}%`,
          transform: 'translate(-50%, -50%)',
          ...fontStyle
        }}
        onClick={() => handleTextClick(elemento.id)}
        onPointerDown={(e) => {
          if (!editMode) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging({ id: elemento.id, type: 'text' });
        }}
      >
        {isEditing ? (
          <Textarea
            value={elemento.texto}
            onChange={(e) => updateElementoTexto(elemento.id, { texto: e.target.value })}
            onBlur={() => setEditingText(null)}
            autoFocus
            className="min-w-[200px] resize-none"
            style={{ fontFamily: getFontFamily(elemento.fonte.familia) }}
          />
        ) : (
          <span>{elemento.texto}</span>
        )}
        
        {isSelected && editMode && !isEditing && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-2 flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                // Only allow editing for non-reserved text elements
                const lockedIds = new Set(['header-title', 'names', 'message']);
                if (!lockedIds.has(elemento.id)) {
                  setEditingText(elemento.id);
                }
              }}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                updateElementoTexto(elemento.id, { visivel: false });
                setSelectedElement(null);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const getCanvasStyle = () => {
    const settings: CanvasSettings = canvasSettings || {
      aspectRatio: 'portrait',
      width: 400,
      height: 500,
      backgroundFit: 'crop',
      gridEnabled: false,
      snapToGrid: false,
      gridSize: 20
    };
    let width = 400;
    let height = 500;

    switch (settings.aspectRatio) {
      case 'square':
        width = height = 400;
        break;
      case 'portrait':
        width = 400;
        height = 500;
        break;
      case 'landscape':
        width = 600;
        height = 337.5;
        break;
      case 'custom':
        width = settings.width || 400;
        height = settings.height || 500;
        break;
    }

    return {
      width: `${width}px`,
      height: `${height}px`,
      maxWidth: '100%',
      backgroundColor: corSecundaria,
      backgroundImage: fundoImagem ? `url(${fundoImagem})` : undefined,
      backgroundSize: settings.backgroundFit === 'crop' ? 'cover' :
                     settings.backgroundFit === 'stretch' ? '100% 100%' :
                     settings.backgroundFit === 'tile' ? 'repeat' :
                     settings.backgroundFit === 'fit' ? 'contain' : 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: settings.backgroundFit === 'tile' ? 'repeat' : 'no-repeat'
    };
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={cn(
        "relative mx-auto rounded-lg shadow-invitation overflow-hidden",
        className
      )}
      style={{ ...getCanvasStyle(), touchAction: editMode ? 'none' : undefined }}
      >
        {/* Background Overlay */}
        {fundoImagem && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: corSecundaria,
              opacity: (100 - fundoOpacidade) / 100
            }}
          />
        )}

        {/* Grid Pattern */}
        {canvasSettings?.gridEnabled && (
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='${canvasSettings.gridSize}' height='${canvasSettings.gridSize}' viewBox='0 0 ${canvasSettings.gridSize} ${canvasSettings.gridSize}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${corPrimaria.replace('#', '')}' fill-opacity='0.1'%3E%3Cpath d='M0 0h1v1H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        )}

        {/* Decorative Elements */}
        {elementos.filter(el => el.visivel).map((elemento, index) => renderDecorativeElement(elemento, index))}

        {/* Text Elements */}
        {elementosTexto.map((elemento) => renderTextElement(elemento))}

        {/* Background Music */}
        {musicaUrl && (
          <audio autoPlay loop>
            <source src={musicaUrl} />
          </audio>
        )}
        
        <div className="relative p-8 text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div 
              className="flex items-center justify-center mb-4 cursor-pointer"
              onClick={() => editMode && handleTextClick('header-title')}
              style={{ gap: `${decoracaoCabecalho?.espacamento ?? 8}px`, transform: `translateX(${decoracaoCabecalho?.deslocamentoX ?? 0}px)` }}
            >
              {decoracaoCabecalho?.habilitado !== false && (
                (() => {
                  const IconLeft = decoracaoCabecalho?.tipo === 'coracao' ? Heart :
                                   decoracaoCabecalho?.tipo === 'estrela' ? Star :
                                   decoracaoCabecalho?.tipo === 'flor' ? Flower :
                                   decoracaoCabecalho?.tipo === 'cruz' ? Cross : Ribbon;
                  return (
                    <IconLeft
                      className="fill-current"
                      style={{ color: decoracaoCabecalho?.cor || corPrimaria }}
                      size={decoracaoCabecalho?.tamanho || 20}
                    />
                  );
                })()
              )}
              <span
                className="text-sm font-medium tracking-wider"
                style={{
                  color: tituloConviteCor || corPrimaria,
                  fontFamily: estiloTitulo?.familia && getFontFamily(estiloTitulo.familia),
                  fontSize: estiloTitulo?.tamanho,
                  fontWeight: estiloTitulo?.peso,
                  fontStyle: estiloTitulo?.estilo,
                  textDecoration: estiloTitulo?.decoracao,
                  letterSpacing: estiloTitulo?.espacamentoLetras,
                } as React.CSSProperties}
              >
                {tituloConviteTexto || 'CONVITE DE CASAMENTO'}
              </span>
              {decoracaoCabecalho?.habilitado !== false && (
                (() => {
                  const IconRight = decoracaoCabecalho?.tipo === 'coracao' ? Heart :
                                    decoracaoCabecalho?.tipo === 'estrela' ? Star :
                                    decoracaoCabecalho?.tipo === 'flor' ? Flower :
                                    decoracaoCabecalho?.tipo === 'cruz' ? Cross : Ribbon;
                  return (
                    <IconRight
                      className="fill-current"
                      style={{ color: decoracaoCabecalho?.cor || corPrimaria }}
                      size={decoracaoCabecalho?.tamanho || 20}
                    />
                  );
                })()
              )}
            </div>
            
            <h1 
              className="font-heading text-3xl text-center leading-tight cursor-pointer"
              style={{
                color: estiloNomes?.cor || corTexto,
                fontFamily: estiloNomes?.familia && getFontFamily(estiloNomes.familia),
                fontSize: estiloNomes?.tamanho || 30,
                fontWeight: estiloNomes?.peso || 'bold',
                fontStyle: estiloNomes?.estilo || 'normal',
                textAlign: estiloNomes?.alinhamento || 'center',
              } as React.CSSProperties}
              onClick={() => editMode && handleTextClick('names')}
            >
              {editingText === 'names' ? (
                <div className="space-y-2">
                  <Input
                    value={`${primeiroNome} ${sobrenome}`}
                    onChange={(e) => {
                      // Update names
                    }}
                    onBlur={() => setEditingText(null)}
                    autoFocus
                    className="text-center"
                  />
                  <span className="block text-xl my-2 text-primary">&</span>
                  <Input
                    value={`${parceiroPrimeiroNome} ${parceiroSobrenome}`}
                    onChange={(e) => {
                      // Update partner names
                    }}
                    onBlur={() => setEditingText(null)}
                    className="text-center"
                  />
                </div>
              ) : (
                <>
                  {primeiroNome} {sobrenome}
                  <span
                    className="block text-xl my-2"
                    style={{ color: estiloNomes?.cor || corTexto }}
                  >
                    &
                  </span>
                  {parceiroPrimeiroNome} {parceiroSobrenome}
                </>
              )}
            </h1>
          </div>

          {/* Middle Decoration (unified with side decorations) */}
          {decoracaoCentral?.habilitado !== false && (
            <div
              className="flex items-center justify-center py-4"
              style={{
                gap: '16px',
                transform: `translate(${decoracaoCentral?.deslocamentoX || 0}px, ${decoracaoCentral?.deslocamentoY || 0}px)`
              }}
            >
              {/* Left line */}
              {decoracaoCentral?.linhasVisiveis !== false && (
                <div
                  className="h-0.5 opacity-30"
                  style={{
                    width:
                      (decoracaoCentral?.linhasComprimento || 'medio') === 'curto' ? '2rem' :
                      (decoracaoCentral?.linhasComprimento || 'medio') === 'longo' ? '5rem' : '4rem',
                    backgroundColor: (decoracaoCentral?.sincronizarComLaterais ?? true)
                      ? (decoracaoCabecalho?.cor || corPrimaria)
                      : (decoracaoCentral?.cor || decoracaoCabecalho?.cor || corPrimaria)
                  }}
                />
              )}

              {/* Middle icon */}
              {(() => {
                const synced = decoracaoCentral?.sincronizarComLaterais ?? true;
                const tipo = synced ? (decoracaoCabecalho?.tipo || 'coracao') : (decoracaoCentral?.tipo || 'coracao');
                const Icon = tipo === 'coracao' ? Heart : tipo === 'estrela' ? Star : tipo === 'flor' ? Flower : tipo === 'cruz' ? Cross : Ribbon;
                const cor = synced ? (decoracaoCabecalho?.cor || corPrimaria) : (decoracaoCentral?.cor || decoracaoCabecalho?.cor || corPrimaria);
                const tamanhoBase = synced ? (decoracaoCabecalho?.tamanho || 20) : (decoracaoCentral?.tamanho || 24);
                const tamanho = Math.round(tamanhoBase * 1.1); // slightly larger by default
                return (
                  <Icon className="fill-current" style={{ color: cor }} size={tamanho} />
                );
              })()}

              {/* Right line */}
              {decoracaoCentral?.linhasVisiveis !== false && (
                <div
                  className="h-0.5 opacity-30"
                  style={{
                    width:
                      (decoracaoCentral?.linhasComprimento || 'medio') === 'curto' ? '2rem' :
                      (decoracaoCentral?.linhasComprimento || 'medio') === 'longo' ? '5rem' : '4rem',
                    backgroundColor: (decoracaoCentral?.sincronizarComLaterais ?? true)
                      ? (decoracaoCabecalho?.cor || corPrimaria)
                      : (decoracaoCentral?.cor || decoracaoCabecalho?.cor || corPrimaria)
                  }}
                />
              )}
          </div>
          )}

          {/* Event Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span
                className="text-sm"
                style={{
                  color: estiloDetalhes?.cor,
                  fontFamily: estiloDetalhes?.familia && getFontFamily(estiloDetalhes.familia),
                  fontSize: estiloDetalhes?.tamanho,
                  fontWeight: estiloDetalhes?.peso,
                  fontStyle: estiloDetalhes?.estilo,
                } as React.CSSProperties}
              >
                {formatDate(dataCasamento)}
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span
                className="text-sm"
                style={{
                  color: estiloDetalhes?.cor,
                  fontFamily: estiloDetalhes?.familia && getFontFamily(estiloDetalhes.familia),
                  fontSize: estiloDetalhes?.tamanho,
                  fontWeight: estiloDetalhes?.peso,
                  fontStyle: estiloDetalhes?.estilo,
                } as React.CSSProperties}
              >
                {cidade}, {provincia}
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p
              className="text-sm italic text-center"
              style={{
                color: estiloMensagem?.cor || undefined,
                fontFamily: estiloMensagem?.familia && getFontFamily(estiloMensagem.familia),
                fontSize: estiloMensagem?.tamanho,
                fontWeight: estiloMensagem?.peso,
                fontStyle: estiloMensagem?.estilo || 'italic',
              } as React.CSSProperties}
            >
              {`"${mensagemPersonalizada}"`}
            </p>
            
            <div className="pt-4">
              <p
                className="text-xs text-center"
                style={{
                  color: estiloRodape?.cor || 'var(--muted-foreground)',
                  fontFamily: estiloRodape?.familia && getFontFamily(estiloRodape.familia),
                  fontSize: estiloRodape?.tamanho,
                  fontWeight: estiloRodape?.peso,
                  fontStyle: estiloRodape?.estilo,
                } as React.CSSProperties}
              >
                Sua presença é o nosso maior presente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Mode Controls */}
      {editMode && selectedElement && (
        isMobile ? (
          <Sheet open onOpenChange={() => setSelectedElement(null)}>
            <SheetContent side="bottom" className="w-full max-w-full">
              <SheetHeader>
                <SheetTitle>Editar Elemento</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-2">
                {(() => {
                  const designEl = elementos.find(e => e.id === selectedElement);
                  const textEl = elementosTexto.find(e => e.id === selectedElement);
                  if (designEl) {
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Label className="w-24 text-xs">Cor</Label>
                          <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: designEl.cor }} onClick={() => document.getElementById(`mobile-el-color-${designEl.id}`)?.click()} />
                          <Input id={`mobile-el-color-${designEl.id}`} type="color" className="sr-only" value={designEl.cor} onChange={(e) => updateElementoDesign(designEl.id, { cor: e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-xs">Tamanho</Label>
                          <Slider value={[designEl.tamanho]} onValueChange={(v) => updateElementoDesign(designEl.id, { tamanho: v[0] })} min={8} max={64} step={1} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => updateElementoDesign(designEl.id, { rotacao: (designEl.rotacao || 0) + 45 })}>
                            <RotateCw className="w-3 h-3 mr-1" /> Girar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => updateElementoDesign(designEl.id, { visivel: false })}>
                            <X className="w-3 h-3 mr-1" /> Ocultar
                          </Button>
                        </div>
                      </div>
                    );
                  }
                  if (textEl) {
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Label className="w-24 text-xs">Cor</Label>
                          <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: textEl.fonte.cor }} onClick={() => document.getElementById(`mobile-text-color-${textEl.id}`)?.click()} />
                          <Input id={`mobile-text-color-${textEl.id}`} type="color" className="sr-only" value={textEl.fonte.cor} onChange={(e) => updateElementoTexto(textEl.id, { fonte: { ...textEl.fonte, cor: e.target.value } })} />
                        </div>
                        <div>
                          <Label className="text-xs">Tamanho do Texto</Label>
                          <Slider value={[textEl.fonte.tamanho]} onValueChange={(v) => updateElementoTexto(textEl.id, { fonte: { ...textEl.fonte, tamanho: v[0] } })} min={10} max={64} step={1} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={textEl.visivel} onCheckedChange={(checked) => updateElementoTexto(textEl.id, { visivel: checked })} />
                          <Label className="text-xs">Visível</Label>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
        <Card className="absolute top-0 right-0 w-80 z-10">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Editar Elemento</h3>
              {/* Placeholder for desktop side panel controls (future extension) */}
          </CardContent>
        </Card>
        )
      )}
    </div>
  );
};