'use client';

import { useState } from 'react';
import { Heart, ArrowRight, CheckCircle, Users, Calendar, Palette, Settings } from 'lucide-react';
import CoupleRegistration from '@/components/onboarding/CoupleRegistration';
import InvitationDesigner from '@/components/design/InvitationDesigner';
import EventConfiguration from '@/components/wedding/EventConfiguration';
import UserManagement from '@/components/admin/UserManagement';

export default function NewWeddingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: 'Registo do Casal',
      description: 'Informações básicas dos noivos',
      icon: Users,
      component: CoupleRegistration,
    },
    {
      id: 2,
      title: 'Configuração de Eventos',
      description: 'Datas, locais e detalhes dos eventos',
      icon: Calendar,
      component: EventConfiguration,
    },
    {
      id: 3,
      title: 'Designer de Convites',
      description: 'Personalização visual dos convites',
      icon: Palette,
      component: InvitationDesigner,
    },
    {
      id: 4,
      title: 'Gestão de Utilizadores',
      description: 'Configurar acessos e permissões',
      icon: Settings,
      component: UserManagement,
    },
  ];

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) => [...prev, stepId]);
    }
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    }
  };

  const getCurrentComponent = () => {
    const step = steps.find((s) => s.id === currentStep);
    if (step) {
      const Component = step.component;
      return <Component onComplete={() => handleStepComplete(currentStep)} />;
    }
    return null;
  };

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);
  const isStepActive = (stepId: number) => stepId === currentStep;
  const isStepAccessible = (stepId: number) => stepId <= currentStep;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Heart className="h-8 w-8 text-rose-600" />
              <h1 className="text-3xl font-bold text-gray-900">Novo Casamento</h1>
              <Heart className="h-8 w-8 text-rose-600" />
            </div>
            <p className="text-gray-600">Configure o seu casamento em 4 passos simples</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = isStepCompleted(step.id);
              const isActive = isStepActive(step.id);
              const isAccessible = isStepAccessible(step.id);

              return (
                <div key={step.id} className="flex items-center">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => isAccessible && setCurrentStep(step.id)}
                      disabled={!isAccessible}
                      className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 text-white shadow-lg'
                          : isActive
                            ? 'bg-rose-600 text-white shadow-lg ring-4 ring-rose-200'
                            : isAccessible
                              ? 'border-2 border-gray-300 bg-white text-gray-400 hover:border-rose-300 hover:text-rose-600'
                              : 'cursor-not-allowed border-2 border-gray-200 bg-gray-100 text-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-8 w-8" />
                      ) : (
                        <Icon className="h-8 w-8" />
                      )}
                    </button>

                    <div className="mt-3 text-center">
                      <h3
                        className={`text-sm font-semibold ${
                          isActive
                            ? 'text-rose-600'
                            : isCompleted
                              ? 'text-green-600'
                              : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-1 max-w-24 text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-1 flex-1 rounded-full transition-all duration-300 ${
                        isStepCompleted(step.id) ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          {/* Step Header */}
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {(() => {
                  const step = steps.find((s) => s.id === currentStep);
                  if (step) {
                    const Icon = step.icon;
                    return (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{step.title}</h2>
                          <p className="text-rose-100">{step.description}</p>
                        </div>
                      </>
                    );
                  }
                  return null;
                })()}
              </div>

              <div className="text-right">
                <div className="text-sm text-rose-100">Passo</div>
                <div className="text-2xl font-bold">
                  {currentStep} de {steps.length}
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">{getCurrentComponent()}</div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-8 py-6">
            <button
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors ${
                currentStep === 1
                  ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Anterior
            </button>

            <div className="flex items-center gap-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    isStepCompleted(step.id)
                      ? 'bg-green-500'
                      : isStepActive(step.id)
                        ? 'bg-rose-600'
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => handleStepComplete(currentStep)}
              disabled={currentStep === steps.length && isStepCompleted(currentStep)}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors ${
                currentStep === steps.length && isStepCompleted(currentStep)
                  ? 'bg-green-600 text-white'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {currentStep === steps.length ? 'Finalizar' : 'Próximo'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Completion Summary */}
        {completedSteps.length === steps.length && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-green-800">
              🎉 Parabéns! Configuração Completa
            </h2>
            <p className="mb-6 text-green-700">
              O seu casamento foi configurado com sucesso. Agora pode começar a gerir todos os
              aspectos do seu grande dia!
            </p>
            <div className="flex justify-center gap-4">
              <button className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700">
                Ir para Dashboard
              </button>
              <button className="rounded-lg border border-green-300 bg-white px-8 py-3 font-semibold text-green-600 transition-colors hover:bg-gray-50">
                Ver Convite
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
