import React from 'react';
import { Info, Users2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface ILPIStaffCalculatorProps {
  level1: number;
  level2: number;
  level3: number;
  /** Only caregivers (federal) */
  currentCaregivers: number;
  /** Nursing techs – only used in RJ mode */
  currentNursingTechs?: number;
  /** When true, shows the RJ split-calculator (Lei 8.049/18) */
  isRJ?: boolean;
}

// ─── Federal (RDC 502/2021): Cuidadores ──────────────────────
function calcFederal(l1: number, l2: number, l3: number) {
  const grau1 = Math.max(0, Math.ceil(l1 / 20));
  const grau2 = l2 > 0 ? Math.max(2, Math.ceil(l2 / 10)) : 0;
  const grau3 = l3 > 0 ? Math.max(2, Math.ceil(l3 / 6)) : 0;
  return { grau1, grau2, grau3, total: grau1 + grau2 + grau3 };
}

// ─── RJ – Lei 8.049/18: Cuidadores ───────────────────────────
// Grau I: 1:15  Grau II: 1:8  Grau III: 1:5
function calcRJCaregivers(l1: number, l2: number, l3: number) {
  const grau1 = Math.max(0, Math.ceil(l1 / 15));
  const grau2 = l2 > 0 ? Math.max(1, Math.ceil(l2 / 8)) : 0;
  const grau3 = l3 > 0 ? Math.max(1, Math.ceil(l3 / 5)) : 0;
  return { grau1, grau2, grau3, total: grau1 + grau2 + grau3 };
}

// ─── RJ – Lei 8.049/18: Técnicos de Enfermagem ───────────────
// Grau II: 1 técnico para 15 residentes
// Grau III: 1 técnico para 10 residentes
function calcRJNursingTechs(l2: number, l3: number) {
  const reqL2 = l2 > 0 ? Math.max(0, Math.ceil(l2 / 15)) : 0;
  const reqL3 = l3 > 0 ? Math.max(0, Math.ceil(l3 / 10)) : 0;
  // A lei exige pelomenos 1 técnico se houver residentes grau II ou III? 
  // Geralmente sim, vamos manter o Math.max(1, ...) se houver residentes.
  const total = (l2 + l3) > 0 ? Math.max(1, reqL2 + reqL3) : 0;
  return { reqL2, reqL3, total };
}

// ─── Shared display helpers ───────────────────────────────────
interface ScoreRowProps {
  label: string;
  required: number;
  actual: number;
  onChange: (v: number) => void;
}
function ScoreRow({ label, required, actual, onChange }: ScoreRowProps) {
  const ok = actual >= required && required > 0;
  const color = ok ? 'text-green-600' : 'text-red-600';
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="flex-1 text-gray-600">{label}</span>
      <span className="text-gray-500">Mín: <strong>{required}</strong></span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          value={actual || ''}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className={`w-16 border rounded px-2 py-1 text-sm font-bold text-right ${ok ? 'border-green-300' : 'border-red-300'}`}
        />
        {required > 0 && (ok
          ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
          : <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
        )}
      </div>
    </div>
  );
}

export function ILPIStaffCalculator({
  level1, level2, level3,
  currentCaregivers,
  currentNursingTechs = 0,
  isRJ = false,
}: ILPIStaffCalculatorProps) {
  const hasResidents = level1 + level2 + level3 > 0;

  if (!hasResidents) {
    return (
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          Preencha o número de residentes por grau de dependência para calcular o dimensionamento mínimo.
        </p>
      </div>
    );
  }

  // ─── Federal mode ─────────────────────────────────────────
  if (!isRJ) {
    const req = calcFederal(level1, level2, level3);
    const ok = currentCaregivers >= req.total;
    return (
      <Card className={ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className={ok ? 'text-green-600' : 'text-red-600'} />
              <h4 className="font-bold text-gray-900 text-sm">Cuidadores — RDC 502/2021</h4>
            </div>
            {ok
              ? <CheckCircle2 className="text-green-600 h-6 w-6" />
              : <AlertTriangle className="text-red-600 h-6 w-6" />}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase font-bold text-gray-500">
            <div className="bg-white/60 p-2 rounded">Grau I<br /><span className="text-base text-gray-800">{req.grau1}</span></div>
            <div className="bg-white/60 p-2 rounded">Grau II<br /><span className="text-base text-gray-800">{req.grau2}</span></div>
            <div className="bg-white/60 p-2 rounded">Grau III<br /><span className="text-base text-gray-800">{req.grau3}</span></div>
          </div>

          <div className="flex items-end justify-between border-t border-gray-200 pt-3">
            <div>
              <p className="text-xs text-gray-500">Total necessário (por turno)</p>
              <p className="text-2xl font-black text-gray-900">{req.total}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Déficit / Superávit</p>
              <p className={`text-xl font-bold ${ok ? 'text-green-600' : 'text-red-600'}`}>
                {ok ? `+${currentCaregivers - req.total}` : `-${req.total - currentCaregivers}`}
              </p>
            </div>
          </div>

          {!ok && (
            <p className="text-[11px] text-red-700 font-medium bg-red-100 p-2 rounded">
              Atenção: equipe atual de <strong>{currentCaregivers}</strong> cuidador(es) está abaixo do mínimo de <strong>{req.total}</strong>.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // ─── RJ mode ──────────────────────────────────────────────
  const reqCare = calcRJCaregivers(level1, level2, level3);
  const reqNurse = calcRJNursingTechs(level2, level3);
  const careOk = currentCaregivers >= reqCare.total;
  const nurseOk = currentNursingTechs >= reqNurse.total || reqNurse.total === 0;
  const allOk = careOk && nurseOk;

  return (
    <div className="space-y-3">
      {/* Cuidadores RJ */}
      <Card className={careOk ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className={careOk ? 'text-green-600' : 'text-red-600'} />
              <h4 className="font-bold text-gray-900 text-sm">Cuidadores — Lei 8.049/18 (RJ)</h4>
            </div>
            {careOk
              ? <CheckCircle2 className="text-green-600 h-5 w-5" />
              : <AlertTriangle className="text-red-600 h-5 w-5" />}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase font-bold text-gray-500">
            <div className="bg-white/60 p-2 rounded">Grau I (1:15)<br /><span className="text-base text-gray-800">{reqCare.grau1}</span></div>
            <div className="bg-white/60 p-2 rounded">Grau II (1:8)<br /><span className="text-base text-gray-800">{reqCare.grau2}</span></div>
            <div className="bg-white/60 p-2 rounded">Grau III (1:5)<br /><span className="text-base text-gray-800">{reqCare.grau3}</span></div>
          </div>
          <div className="flex items-end justify-between border-t border-gray-200 pt-3">
            <div>
              <p className="text-xs text-gray-500">Total necessário (por turno)</p>
              <p className="text-2xl font-black text-gray-900">{reqCare.total}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Déficit / Superávit</p>
              <p className={`text-xl font-bold ${careOk ? 'text-green-600' : 'text-red-600'}`}>
                {careOk ? `+${currentCaregivers - reqCare.total}` : `-${reqCare.total - currentCaregivers}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Técnicos de Enfermagem RJ */}
      {reqNurse.total > 0 && (
        <Card className={nurseOk ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users2 className={nurseOk ? 'text-green-600' : 'text-red-600'} />
                <h4 className="font-bold text-gray-900 text-sm">Técnicos de Enfermagem — Lei 8.049/18 (RJ)</h4>
              </div>
              {nurseOk
                ? <CheckCircle2 className="text-green-600 h-5 w-5" />
                : <AlertTriangle className="text-red-600 h-5 w-5" />}
            </div>
            <p className="text-xs text-gray-500">
              Mínimo: 1:15 p/ Grau II ({level2}) e 1:10 p/ Grau III ({level3}) → {reqNurse.total} técnico(s) no total.
            </p>
            <div className="flex items-end justify-between border-t border-gray-200 pt-3">
              <div>
                <p className="text-xs text-gray-500">Total necessário (por turno)</p>
                <p className="text-2xl font-black text-gray-900">{reqNurse.total}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Déficit / Superávit</p>
                <p className={`text-xl font-bold ${nurseOk ? 'text-green-600' : 'text-red-600'}`}>
                  {nurseOk ? `+${currentNursingTechs - reqNurse.total}` : `-${reqNurse.total - currentNursingTechs}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!allOk && (
        <p className="text-[11px] text-red-700 font-medium bg-red-100 p-2 rounded">
          Atenção: há não conformidade no dimensionamento de pessoal conforme Lei 8.049/18.
        </p>
      )}
    </div>
  );
}
