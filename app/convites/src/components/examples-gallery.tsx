import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvitationPreview } from '@/components/wedding/invitation-preview';
import { exampleInvitations, ExampleInvitation } from '@/data/examples';
import { Heart, X, Eye, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExamplesGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryLabels = {
  classico: 'Clássico',
  moderno: 'Moderno',
  romantico: 'Romântico',
  tropical: 'Tropical',
  elegante: 'Elegante'
};

const categoryColors = {
  classico: 'bg-green-100 text-green-800',
  moderno: 'bg-blue-100 text-blue-800',
  romantico: 'bg-pink-100 text-pink-800',
  tropical: 'bg-yellow-100 text-yellow-800',
  elegante: 'bg-purple-100 text-purple-800'
};

export const ExamplesGallery: React.FC<ExamplesGalleryProps> = ({
  open,
  onOpenChange
}) => {
  const navigate = useNavigate();
  const [selectedExample, setSelectedExample] = useState<ExampleInvitation | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredExamples = activeCategory === 'all' 
    ? exampleInvitations 
    : exampleInvitations.filter(example => example.category === activeCategory);

  const handleUseExample = (example: ExampleInvitation) => {
    // Navigate to create page with example data
    navigate('/criar', { 
      state: { 
        exampleData: {
          casal: example.casal,
          design: example.design
        }
      }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                 <DialogHeader>
           <DialogTitle className="text-2xl font-heading text-primary">
             Exemplos de Convites
           </DialogTitle>
           <p className="text-muted-foreground">
             Explore diferentes estilos e inspire-se para criar seu convite perfeito
           </p>
         </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="classico">Clássico</TabsTrigger>
              <TabsTrigger value="moderno">Moderno</TabsTrigger>
              <TabsTrigger value="romantico">Romântico</TabsTrigger>
              <TabsTrigger value="tropical">Tropical</TabsTrigger>
              <TabsTrigger value="elegante">Elegante</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto">
                {filteredExamples.map((example) => (
                  <Card 
                    key={example.id} 
                    className="group hover:shadow-elegant transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedExample(example)}
                  >
                    <CardContent className="p-4 space-y-4">
                      {/* Preview */}
                      <div className="relative bg-white rounded-lg p-3 border">
                        <div className="scale-75 origin-top-left transform">
                          <InvitationPreview 
                            casal={example.casal} 
                            design={example.design}
                            className="w-full"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground">
                            {example.name}
                          </h3>
                          <Badge className={categoryColors[example.category]}>
                            {categoryLabels[example.category]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {example.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {example.casal.primeiroNome} & {example.casal.parceiroPrimeiroNome}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExample(example);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseExample(example);
                          }}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Usar Este
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

                 {/* Detail View */}
         {selectedExample && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setSelectedExample(null)}>
             <div className="bg-background rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-heading text-primary">
                   {selectedExample.name}
                 </h2>
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={() => setSelectedExample(null)}
                 >
                   <X className="w-4 h-4" />
                 </Button>
               </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preview */}
                <div className="space-y-4">
                  <h3 className="font-medium">Visualização</h3>
                  <div className="bg-white p-4 rounded-lg border">
                    <InvitationPreview 
                      casal={selectedExample.casal} 
                      design={selectedExample.design}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Detalhes</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Casal:</span> {selectedExample.casal.primeiroNome} & {selectedExample.casal.parceiroPrimeiroNome}
                      </div>
                      <div>
                        <span className="font-medium">Data:</span> {selectedExample.casal.dataCasamento?.toLocaleDateString('pt-MZ')}
                      </div>
                      <div>
                        <span className="font-medium">Local:</span> {selectedExample.casal.cidade}, {selectedExample.casal.provincia}
                      </div>
                      <div>
                        <span className="font-medium">Mensagem:</span> "{selectedExample.design.mensagemPersonalizada}"
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Características</h3>
                    <div className="space-y-2">
                      <Badge className={categoryColors[selectedExample.category]}>
                        {categoryLabels[selectedExample.category]}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {selectedExample.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      className="w-full bg-gradient-primary"
                      onClick={() => handleUseExample(selectedExample)}
                    >
                      <Heart className="w-4 h-4 mr-2 fill-current" />
                      Usar Este Modelo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
