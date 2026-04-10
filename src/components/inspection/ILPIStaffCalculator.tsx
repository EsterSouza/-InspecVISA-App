import React from 'react';
import { Info, Users2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface ILPIStaffCalculatorProps {
  level1: number;
  level2: number;
  level3: number;
  currentStaff: number; // The user will input this in the checklist
}

export function ILPIStaffCalculator({ level1, level2, level3, currentStaff }: ILPIStaffCalculatorProps) {
  // RDC 502/2021 Calculations
  // I: 1 per 20 (min 1)
  // II: 1 per 10 (min 2)
  // III: 1 per 5 (min 2)
  
  const reqL1 = Math.max(0, Math.ceil(level1 / 20));
  const reqL2 = level2 > 0 ? Math.max(2, Math.ceil(level2 / 10)) : 0;
  const reqL3 = level3 > 0 ? Math.max(2, Math.ceil(level3 / 6)) : 0;
  
  const totalRequired = reqL1 + reqL2 + reqL3;
  const isCompliant = currentStaff >= totalRequired;
  const diff = totalRequired - currentStaff;

  if (level1 + level2 + level3 === 0) {
    return (
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-500 shrink-0" />
        <p className="text-sm text-amber-700">
          Preencha o número de residentes por grau de dependência para calcular o dimensionamento mínimo de cuidadores/técnicos.
        </p>
      </div>
    );
  }

  return (
    <Card className={isCompliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className={isCompliant ? 'text-green-600' : 'text-red-600'} />
            <h4 className="font-bold text-gray-900">Dimensionamento (RDC 502 / Lei 8.049)</h4>
          </div>
          {isCompliant ? (
            <CheckCircle2 className="text-green-600 h-6 w-6" />
          ) : (
            <AlertTriangle className="text-red-600 h-6 w-6" />
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase font-bold text-gray-500">
          <div className="bg-white/50 p-2 rounded">Grau I: {reqL1}</div>
          <div className="bg-white/50 p-2 rounded">Grau II: {reqL2}</div>
          <div className="bg-white/50 p-2 rounded">Grau III: {reqL3}</div>
        </div>

        <div className="flex items-end justify-between border-t border-gray-200 pt-3">
          <div>
            <p className="text-xs text-gray-500">Total Necessário (por turno)</p>
            <p className="text-2xl font-black text-gray-900">{totalRequired}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Déficit/Superávit</p>
            <p className={`text-xl font-bold ${isCompliant ? 'text-green-600' : 'text-red-600'}`}>
              {isCompliant ? `+${currentStaff - totalRequired}` : `-${diff}`}
            </p>
          </div>
        </div>

        {!isCompliant && (
          <p className="text-[11px] text-red-700 font-medium bg-red-100 p-2 rounded">
            Atenção: A equipe atual de <strong>{currentStaff}</strong> profissional(is) está abaixo do mínimo exigido de <strong>{totalRequired}</strong> para esta configuração de residentes.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
