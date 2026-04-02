import React, { useRef, useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { compressImage } from '../utils/imageUtils';
import { db } from '../db/database';
import { exportDatabase, importDatabase } from '../utils/backup';
import { Save, Upload, Trash2, Moon, Sun, Monitor, Database, Download, RefreshCw, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Settings() {
  const { settings, updateSettings, clearData } = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');


  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 400, 0.9); // smaller for logo
      updateSettings({ logoDataUrl: dataUrl });
    } catch (err) {
      alert('Erro ao processar logotipo.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeLogo = () => {
    updateSettings({ logoDataUrl: undefined });
  };

  const saveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    // LocalStorage zustand persist is automatic, just show feedback
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleExport = async () => {
    try {
      await exportDatabase();
    } catch (err) {
      alert('Erro ao exportar: ' + err);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (window.confirm('Deseja importar os dados deste arquivo? Registros novos serão adicionados e os existentes serão atualizados.')) {
      try {
        const msg = await importDatabase(file);
        alert(msg);
        window.location.reload();
      } catch (err) {
        alert('Erro na importação: ' + err);
      }
    }
    e.target.value = '';
  };

  const handleClearData = async () => {
    if (window.confirm('ATENÇÃO: Isso apagará permanentemente todos os clientes, inspeções e fotos do seu dispositivo. Tem certeza absoluta?')) {
      if (window.confirm('ÚLTIMO AVISO: Mantenha prosseguir para deletar tudo.')) {
        await Promise.all([
          db.clients.clear(),
          db.inspections.clear(),
          db.responses.clear(),
          db.photos.clear(),
        ]);
        clearData();
        alert('Todos os dados foram apagados.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500">Ajuste seu perfil e preferências do relátorio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil do Consultor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveForm} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={settings.name}
                  onChange={(e) => updateSettings({ name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Seu nome"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome da Empresa (Opcional)</label>
                <input
                  type="text"
                  value={settings.companyName || ''}
                  onChange={(e) => updateSettings({ companyName: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Nome exibido no rodapé do PDF"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Telefone de Contato</label>
                <input
                  type="text"
                  value={settings.phone || ''}
                  onChange={(e) => updateSettings({ phone: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2 col-span-1 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Perfil de Atuação (Filtro de Roteiro)</label>
                <div className="flex flex-wrap gap-4 mt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="ambos" 
                      checked={settings.consultantRole === 'ambos' || !settings.consultantRole} 
                      onChange={() => updateSettings({ consultantRole: 'ambos' })} 
                      className="text-primary-600 focus:ring-primary-500 w-4 h-4" 
                    />
                    <span className="text-sm text-gray-700">Todas as áreas (Completo)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="saude" 
                      checked={settings.consultantRole === 'saude'} 
                      onChange={() => updateSettings({ consultantRole: 'saude' })} 
                      className="text-primary-600 focus:ring-primary-500 w-4 h-4" 
                    />
                    <span className="text-sm text-gray-700">Assistência à Saúde (Ester)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      value="nutricao" 
                      checked={settings.consultantRole === 'nutricao'} 
                      onChange={() => updateSettings({ consultantRole: 'nutricao' })} 
                      className="text-primary-600 focus:ring-primary-500 w-4 h-4" 
                    />
                    <span className="text-sm text-gray-700">Nutrição/UAN (Ana)</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Isso afetará quais seções aparecerão no roteiro ILPI.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo de Registro profissional</label>
                <input
                  type="text"
                  value={settings.professionalIdLabel || ''}
                  onChange={(e) => updateSettings({ professionalIdLabel: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Ex: CRBM, CRN, CRM..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Número do Registro</label>
                <input
                  type="text"
                  value={settings.professionalId || ''}
                  onChange={(e) => updateSettings({ professionalId: e.target.value })}
                  className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Ex: 123456-7"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Logotipo para o Relatório (PDF)</h4>
              <div className="flex items-center space-x-6">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  {settings.logoDataUrl ? (
                    <img src={settings.logoDataUrl} alt="Logo" className="h-full w-full object-contain p-2" />
                  ) : (
                    <span className="text-xs text-gray-400">Sem logo</span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Fazer Upload
                    </Button>
                    {settings.logoDataUrl && (
                      <Button type="button" variant="ghost" size="sm" onClick={removeLogo} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Recomendado: Imagem retangular ou quadrada c/ fundo transparente (PNG).</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <Button type="submit" disabled={saveStatus === 'saving'} className="min-w-[120px]">
                {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'saved' ? 'Salvo ✓' : (
                  <><Save className="mr-2 h-4 w-4" /> Salvar Perfil</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-primary-600" />
            Backup e Sincronização Manual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Utilize estas opções para mover seus dados entre dispositivos (ex: do celular para o computador) ou para manter uma cópia de segurança completa (incluindo fotos).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Exportar Banco (.json)
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                className="hidden"
                id="import-db"
                onChange={handleImport}
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('import-db')?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar Banco (.json)
              </Button>
            </div>
          </div>
          <div className="rounded-md bg-blue-50 p-3 flex items-start space-x-3 border border-blue-100">
             <RefreshCw className="h-5 w-5 text-blue-600 shrink-0 mt-0.5 animate-spin-slow" />
             <div className="text-xs text-blue-800 space-y-1">
               <p><strong>Consolidação de Equipe:</strong> Peça para Ana e Ester exportarem seus bancos e te enviarem. </p>
               <p>Ao importar os arquivos delas no seu computador "Mestre", o Dashboard mostrará a média e as recorrências de **todas** as inspeções somadas.</p>
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-700">
            <Bug className="mr-2 h-5 w-5" />
            Suporte e Diagnóstico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            Se a sincronização não estiver funcionando, use esta ferramenta para identificar o erro técnico.
          </p>
          <Link to="/debug">
            <Button variant="outline" className="w-full">
              Ver Logs de Sincronização
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-purple-50 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-700">
            <Upload className="mr-2 h-5 w-5" />
            Migração de Dados (Equipe)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-600 mb-4 font-medium">
            Importe o backup da conta antiga da Ana para consolidar as inspeções de Nutrição com os seus registros atuais.
          </p>
          <Link to="/importar-dados">
            <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100 font-bold">
              Iniciar Consolidação Inteligente
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="border-red-100 bg-red-50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-red-900 text-lg">Zona de Perigo</h3>
              <p className="text-sm text-red-700 mt-1">Apagar todos os dados locais do aplicativo. Esta ação não pode ser desfeita e todas as inspeções serão perdidas.</p>
            </div>
            <Button variant="danger" onClick={handleClearData} className="whitespace-nowrap shrink-0">
              <Trash2 className="mr-2 h-4 w-4" />
              Apagar Tudo
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-gray-400 pb-10">
        InspecVISA PWA v1.0.0 • Dados salvos localmente
      </div>
    </div>
  );
}
