import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, Share2, Calendar, MapPin, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-wedding.jpg';
import { ExamplesGallery } from '@/components/examples-gallery';

const Index = () => {
  const navigate = useNavigate();
  const [showExamples, setShowExamples] = useState(false);

  const features = [
    {
      icon: Heart,
      title: 'Convites Personalizados',
      description: 'Crie convites únicos com suas cores, fotos e mensagens especiais'
    },
    {
      icon: MapPin,
      title: 'Localizações de Moçambique',
      description: 'Todas as províncias e cidades de Moçambique disponíveis'
    },
    {
      icon: Calendar,
      title: 'RSVP Inteligente',
      description: 'Gerencie confirmações e acompanhe seus convidados em tempo real'
    },
    {
      icon: Music,
      title: 'Música de Fundo',
      description: 'Adicione trilha sonora especial para seus convites digitais'
    },
    {
      icon: Share2,
      title: 'Compartilhamento Fácil',
      description: 'Envie por WhatsApp, email ou redes sociais com um clique'
    },
    {
      icon: Sparkles,
      title: 'Totalmente Gratuito',
      description: 'Crie quantos convites quiser sem custos ou limitações'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-primary fill-current" />
              <span className="text-xl font-heading text-primary">Ninho do Amor</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </a>
              <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
                Como Funciona
              </a>
              <Button 
                onClick={() => navigate('/criar')}
                className="bg-gradient-primary hover:opacity-90"
              >
                Começar Agora
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-heading text-foreground leading-tight">
                  O planejamento do casamento{' '}
                  <span className="text-primary">começa aqui</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  De locais e save the dates a um site de casamento gratuito, 
                  um registro e até mesmo o seu bolo — o Ninho do Amor está 
                  aqui para todos os dias ao longo do caminho
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/criar')}
                  className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3"
                >
                  <Heart className="w-5 h-5 mr-2 fill-current" />
                  Criar Meu Convite
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => setShowExamples(true)}
                  className="text-lg px-8 py-3 border-primary/30 hover:bg-primary/5"
                >
                  Ver Exemplos
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>100% Gratuito</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Para todo Moçambique</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Sem Registro</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-20 scale-75"></div>
              <img 
                src={heroImage}
                alt="Casamento elegante em Moçambique com decoração botânica"
                className="relative w-full h-auto rounded-lg shadow-invitation"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading text-foreground mb-4">
              Para todos os trabalhos em equipe{' '}
              <span className="text-primary">ao longo do caminho</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas completas para criar o convite perfeito e gerenciar 
              todos os aspectos do seu grande dia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-sage text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-heading">
              Para o dia em que tudo{' '}
              <span className="text-wedding-gold">começa</span>
            </h2>
            <p className="text-lg opacity-90">
              Comece a criar seu convite digital agora mesmo. 
              É gratuito, fácil e feito especialmente para casais moçambicanos.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/criar')}
              className="bg-wedding-cream text-primary hover:bg-wedding-cream/90 text-lg px-8 py-3"
            >
              <Heart className="w-5 h-5 mr-2 fill-current" />
              Começar Gratuitamente
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-xl font-heading">Ninho do Amor</span>
              </div>
              <p className="text-primary-foreground/80">
                Criando momentos especiais para casais em todo Moçambique
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Recursos</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Convites Digitais</li>
                <li>RSVP Online</li>
                <li>Galeria de Fotos</li>
                <li>Lista de Presentes</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Suporte</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Como Usar</li>
                <li>Perguntas Frequentes</li>
                <li>Contato</li>
                <li>Feedback</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 Ninho do Amor. Feito com ❤️ para Moçambique.</p>
          </div>
        </div>
      </footer>
      
      {/* Examples Gallery Modal */}
      <ExamplesGallery 
        open={showExamples} 
        onOpenChange={setShowExamples}
      />
    </div>
  );
};

export default Index;
