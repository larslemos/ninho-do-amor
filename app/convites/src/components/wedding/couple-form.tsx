import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CasalData } from '@/types/wedding';
import { mozambiqueProvinces } from '@/data/mozambique';
import { Calendar, MapPin, Heart } from 'lucide-react';

interface CoupleFormProps {
  onDataChange: (data: Partial<CasalData>) => void;
  onNext: () => void;
  data: Partial<CasalData>;
}

export const CoupleForm: React.FC<CoupleFormProps> = ({ onDataChange, onNext, data }) => {
  const [selectedProvince, setSelectedProvince] = useState(data.provincia || '');
  const [isDateTBD, setIsDateTBD] = useState(!data.dataCasamento);

  const handleInputChange = (field: keyof CasalData, value: string) => {
    onDataChange({ [field]: value });
  };

  const handleDateChange = (value: string) => {
    if (value) {
      onDataChange({ dataCasamento: new Date(value) });
    }
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    onDataChange({ provincia: province, cidade: '' });
  };

  const selectedProvinceData = mozambiqueProvinces.find(p => p.nome === selectedProvince);
  
  const isFormValid = data.primeiroNome && data.sobrenome && 
                     data.parceiroPrimeiroNome && data.parceiroSobrenome &&
                     data.provincia && data.cidade;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-elegant">
      <CardHeader className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 text-primary mb-2">
          <Heart className="w-5 h-5 fill-current" />
          <CardTitle className="text-2xl font-heading">Dados do Casal</CardTitle>
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <p className="text-muted-foreground">
          Como qualquer grande relacionamento, este começa com o básico
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Noivos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-medium text-primary flex items-center space-x-2">
              <span>Primeiro Noivo</span>
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="primeiroNome">Primeiro Nome</Label>
                <Input
                  id="primeiroNome"
                  value={data.primeiroNome || ''}
                  onChange={(e) => handleInputChange('primeiroNome', e.target.value)}
                  placeholder="João"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sobrenome">Sobrenome</Label>
                <Input
                  id="sobrenome"
                  value={data.sobrenome || ''}
                  onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                  placeholder="Silva"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-primary flex items-center space-x-2">
              <span>Segundo Noivo</span>
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="parceiroPrimeiroNome">Primeiro Nome</Label>
                <Input
                  id="parceiroPrimeiroNome"
                  value={data.parceiroPrimeiroNome || ''}
                  onChange={(e) => handleInputChange('parceiroPrimeiroNome', e.target.value)}
                  placeholder="Maria"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="parceiroSobrenome">Sobrenome</Label>
                <Input
                  id="parceiroSobrenome"
                  value={data.parceiroSobrenome || ''}
                  onChange={(e) => handleInputChange('parceiroSobrenome', e.target.value)}
                  placeholder="Pereira"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data do Casamento */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Data do Casamento</span>
          </Label>
          <div className="space-y-3">
            <Input
              type="date"
              value={data.dataCasamento ? data.dataCasamento.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange(e.target.value)}
              disabled={isDateTBD}
              min={new Date().toISOString().split('T')[0]}
              className="max-w-xs"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dataTBD"
                checked={isDateTBD}
                onCheckedChange={(checked) => {
                  setIsDateTBD(checked as boolean);
                  if (checked) {
                    onDataChange({ dataCasamento: undefined });
                  }
                }}
              />
              <Label htmlFor="dataTBD" className="text-sm text-muted-foreground">
                Ainda estamos decidindo
              </Label>
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Localização</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provincia" className="text-sm">Província</Label>
              <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione a província" />
                </SelectTrigger>
                <SelectContent>
                  {mozambiqueProvinces.map((province) => (
                    <SelectItem key={province.nome} value={province.nome}>
                      {province.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="cidade" className="text-sm">Cidade</Label>
              <Select 
                value={data.cidade || ''} 
                onValueChange={(value) => handleInputChange('cidade', value)}
                disabled={!selectedProvince}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione a cidade" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvinceData?.cidades.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-xs text-muted-foreground text-center mb-4">
            Todos os campos são obrigatórios
          </p>
          <Button 
            onClick={onNext}
            disabled={!isFormValid}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            Próximo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};