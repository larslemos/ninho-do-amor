import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CanvasSettings } from '@/types/wedding';
import { Grid, Settings, Monitor } from 'lucide-react';

interface CanvasSettingsPanelProps {
  settings: CanvasSettings;
  onSettingsChange: (settings: CanvasSettings) => void;
}

const ASPECT_RATIOS = [
  { value: 'square', label: 'Quadrado (1:1)', width: 600, height: 600 },
  { value: 'portrait', label: 'Retrato (4:5)', width: 600, height: 750 },
  { value: 'landscape', label: 'Paisagem (16:9)', width: 800, height: 450 },
  { value: 'custom', label: 'Personalizado', width: 600, height: 600 }
];

const BACKGROUND_FIT_OPTIONS = [
  { value: 'crop', label: 'Cortar' },
  { value: 'stretch', label: 'Esticar' },
  { value: 'tile', label: 'Repetir' },
  { value: 'fit', label: 'Ajustar' }
];

export const CanvasSettingsPanel: React.FC<CanvasSettingsPanelProps> = ({
  settings,
  onSettingsChange
}) => {
  const updateSettings = (updates: Partial<CanvasSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const handleAspectRatioChange = (aspectRatio: string) => {
    const ratio = ASPECT_RATIOS.find(r => r.value === aspectRatio);
    if (ratio) {
      updateSettings({
        aspectRatio: aspectRatio as any,
        width: ratio.width,
        height: ratio.height
      });
    }
  };

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg border">
      <div className="flex items-center space-x-2">
        <Settings className="w-4 h-4 text-primary" />
        <h3 className="font-medium">Configurações do Canvas</h3>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-3">
        <Label className="flex items-center space-x-2">
          <Monitor className="w-4 h-4" />
          <span>Proporção</span>
        </Label>
        <Select value={settings.aspectRatio} onValueChange={handleAspectRatioChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ASPECT_RATIOS.map(ratio => (
              <SelectItem key={ratio.value} value={ratio.value}>
                {ratio.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom Dimensions */}
      {settings.aspectRatio === 'custom' && (
        <div className="space-y-3">
          <Label>Dimensões Personalizadas</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Largura (px)</Label>
              <Input
                type="number"
                value={settings.width}
                onChange={(e) => updateSettings({ width: parseInt(e.target.value) || 600 })}
                min={300}
                max={1920}
              />
            </div>
            <div>
              <Label className="text-xs">Altura (px)</Label>
              <Input
                type="number"
                value={settings.height}
                onChange={(e) => updateSettings({ height: parseInt(e.target.value) || 600 })}
                min={300}
                max={1920}
              />
            </div>
          </div>
        </div>
      )}

      {/* Background Fit */}
      <div className="space-y-3">
        <Label>Ajuste do Fundo</Label>
        <Select value={settings.backgroundFit} onValueChange={(value) => updateSettings({ backgroundFit: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BACKGROUND_FIT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid Settings */}
      <div className="space-y-4">
        <Label className="flex items-center space-x-2">
          <Grid className="w-4 h-4" />
          <span>Grade</span>
        </Label>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Mostrar Grade</Label>
            <Switch
              checked={settings.gridEnabled}
              onCheckedChange={(checked) => updateSettings({ gridEnabled: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-sm">Snap to Grid</Label>
            <Switch
              checked={settings.snapToGrid}
              onCheckedChange={(checked) => updateSettings({ snapToGrid: checked })}
            />
          </div>

          <div>
            <Label className="text-xs">Tamanho da Grade</Label>
            <Input
              type="number"
              value={settings.gridSize}
              onChange={(e) => updateSettings({ gridSize: parseInt(e.target.value) || 20 })}
              min={5}
              max={50}
              step={5}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Label>Ações Rápidas</Label>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateSettings({ width: 600, height: 600, aspectRatio: 'square' })}
            className="flex-1"
          >
            Instagram
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateSettings({ width: 600, height: 750, aspectRatio: 'portrait' })}
            className="flex-1"
          >
            Story
          </Button>
        </div>
      </div>
    </div>
  );
};