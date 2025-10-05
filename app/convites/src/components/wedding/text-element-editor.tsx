import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ElementoTexto, FonteTexto } from '@/types/wedding';
import { FONT_OPTIONS, FONT_CATEGORIES, getFilteredFonts } from '@/lib/fonts';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline, Type, Palette, Move, Lock, Unlock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextElementEditorProps {
  element: ElementoTexto;
  onUpdate: (element: ElementoTexto) => void;
  onDelete: () => void;
  isSelected?: boolean;
}

export const TextElementEditor: React.FC<TextElementEditorProps> = ({
  element,
  onUpdate,
  onDelete,
  isSelected = false
}) => {
  const [fontCategory, setFontCategory] = useState('all');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const updateElement = (updates: Partial<ElementoTexto>) => {
    onUpdate({ ...element, ...updates });
  };

  const updateFont = (updates: Partial<FonteTexto>) => {
    updateElement({
      fonte: { ...element.fonte, ...updates }
    });
  };

  const filteredFonts = getFilteredFonts(fontCategory);

  return (
    <div className={cn(
      "border rounded-lg p-4 space-y-4 transition-all",
      isSelected ? "border-primary bg-accent/20" : "border-border bg-card"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Type className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm capitalize">
            {element.tipo === 'personalizado' ? 'Texto Personalizado' : element.tipo}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => updateElement({ bloqueado: !element.bloqueado })}
            className="h-8 w-8 p-0"
          >
            {element.bloqueado ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <Label>Texto</Label>
        <Textarea
          value={element.texto}
          onChange={(e) => updateElement({ texto: e.target.value })}
          placeholder="Digite o texto..."
          className="min-h-[60px]"
        />
      </div>

      {/* Font Selection */}
      <div className="space-y-3">
        <Label>Fonte</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select value={fontCategory} onValueChange={setFontCategory}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={element.fonte.familia} onValueChange={(value) => updateFont({ familia: value })}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {filteredFonts.map(font => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.googleFont ? font.value : 'inherit' }}>
                    {font.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Tamanho da Fonte</Label>
          <span className="text-sm text-muted-foreground">{element.fonte.tamanho}px</span>
        </div>
        <Slider
          value={[element.fonte.tamanho]}
          onValueChange={([value]) => updateFont({ tamanho: value })}
          min={10}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Text Styling */}
      <div className="space-y-3">
        <Label>Estilo</Label>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={element.fonte.peso === 'bold' ? 'default' : 'outline'}
            onClick={() => updateFont({ peso: element.fonte.peso === 'bold' ? 'normal' : 'bold' })}
            className="h-8 w-8 p-0"
          >
            <Bold className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant={element.fonte.estilo === 'italic' ? 'default' : 'outline'}
            onClick={() => updateFont({ estilo: element.fonte.estilo === 'italic' ? 'normal' : 'italic' })}
            className="h-8 w-8 p-0"
          >
            <Italic className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant={element.fonte.decoracao === 'underline' ? 'default' : 'outline'}
            onClick={() => updateFont({ decoracao: element.fonte.decoracao === 'underline' ? 'none' : 'underline' })}
            className="h-8 w-8 p-0"
          >
            <Underline className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="space-y-3">
        <Label>Alinhamento</Label>
        <div className="flex items-center space-x-2">
          {[
            { value: 'left', icon: AlignLeft },
            { value: 'center', icon: AlignCenter },
            { value: 'right', icon: AlignRight },
            { value: 'justify', icon: AlignJustify }
          ].map(({ value, icon: Icon }) => (
            <Button
              key={value}
              size="sm"
              variant={element.fonte.alinhamento === value ? 'default' : 'outline'}
              onClick={() => updateFont({ alinhamento: value as any })}
              className="h-8 w-8 p-0"
            >
              <Icon className="w-3 h-3" />
            </Button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="space-y-2">
        <Label>Cor do Texto</Label>
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded border cursor-pointer"
            style={{ backgroundColor: element.fonte.cor }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          <Input
            type="color"
            value={element.fonte.cor}
            onChange={(e) => updateFont({ cor: e.target.value })}
            className="w-16 h-8 p-0 border-0"
          />
          <Input
            value={element.fonte.cor}
            onChange={(e) => updateFont({ cor: e.target.value })}
            placeholder="#000000"
            className="flex-1 text-xs"
          />
        </div>
      </div>

      {/* Position Controls */}
      <div className="space-y-2">
        <Label>Posição</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">X</Label>
            <Input
              type="number"
              value={element.posicao.x}
              onChange={(e) => updateElement({
                posicao: { ...element.posicao, x: parseInt(e.target.value) || 0 }
              })}
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Y</Label>
            <Input
              type="number"
              value={element.posicao.y}
              onChange={(e) => updateElement({
                posicao: { ...element.posicao, y: parseInt(e.target.value) || 0 }
              })}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Size Controls */}
      <div className="space-y-2">
        <Label>Tamanho</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Largura</Label>
            <Input
              type="number"
              value={element.tamanho.width}
              onChange={(e) => updateElement({
                tamanho: { ...element.tamanho, width: parseInt(e.target.value) || 100 }
              })}
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Altura</Label>
            <Input
              type="number"
              value={element.tamanho.height}
              onChange={(e) => updateElement({
                tamanho: { ...element.tamanho, height: parseInt(e.target.value) || 50 }
              })}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between">
        <Label>Visível</Label>
        <Button
          size="sm"
          variant={element.visivel ? 'default' : 'outline'}
          onClick={() => updateElement({ visivel: !element.visivel })}
        >
          {element.visivel ? 'Visível' : 'Oculto'}
        </Button>
      </div>
    </div>
  );
};