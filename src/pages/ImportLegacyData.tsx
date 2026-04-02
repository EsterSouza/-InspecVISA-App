import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, FileText, Download, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { consolidateLegacyData, exportCurrentDatabase, type LegacyBackup, type ConsolidationReport } from '../services/migrationService';
import { syncData } from '../services/syncService';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

export function ImportLegacyData() {
  const navigate = useNavigate();
  const [backup, setBackup] = useState<LegacyBackup | null>(null);
  const [report, setReport] = useState<ConsolidationReport | null>(null);
  const [progress, setProgress] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backupDone, setBackupDone] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!data.data || !data.data.clients) {
            throw new Error('Formato de arquivo inválido. Use o JSON exportado via script.');
        }
        setBackup(data);
        setProgress([`✅ Backup da Ana carregado: ${data.data.clients.length} clientes, ${data.data.inspections.length} inspeções`]);
      } catch (err: any) {
        alert('Erro ao ler arquivo: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleSafetyBackup = async () => {
    try {
        await exportCurrentDatabase();
        setBackupDone(true);
        setProgress(prev => [...prev, '🛡️ Backup de segurança gerado com sucesso!']);
    } catch (err) {
        alert('Falha ao gerar backup.');
    }
  };

  const handleConsolidate = async () => {
    if (!backup) return;
    if (!backupDone) {
        if (!window.confirm('Você ainda não criou um backup de segurança. Deseja continuar assim mesmo? É altamente recomendado criar um backup antes de consolidar.')) {
            return;
        }
    }

    setIsProcessing(true);
    setProgress(prev => [...prev, '🔄 Iniciando consolidação...']);

    try {
      const result = await consolidateLegacyData(backup, (msg) => {
        setProgress(prev => [...prev, msg]);
      });

      setReport(result);
      setProgress(prev => [...prev, '✅ Consolidação local concluída! Iniciando sincronização com o servidor...']);

      // Força sync para enviar tudo ao servidor
      await syncData(true);

      setProgress(prev => [...prev, '🚀 Sincronização concluída com sucesso!']);
    } catch (err: any) {
      setProgress(prev => [...prev, `❌ Erro crítico: ${err.message}`]);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-20">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">📦 Importar e Consolidar Dados</h1>
            <p className="text-sm text-gray-500">Mescle informações de diferentes aparelhos ou contas antigas.</p>
        </div>
      </div>

      {!backup && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Selecione o arquivo de backup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer"
                />
                <p className="mt-4 text-xs text-gray-400 italic">Suba o arquivo .json gerado pelo script de exportação.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {backup && !report && (
        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-blue-900 font-bold mb-3">
                    <CheckCircle className="h-5 w-5" />
                    Resumo do Arquivo Carregado:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="bg-white/80 p-3 rounded-lg border border-blue-200 text-center">
                        <div className="text-lg font-bold text-blue-600">{backup.data.clients.length}</div>
                        <div className="text-[10px] uppercase text-gray-500">Clientes</div>
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-blue-200 text-center">
                        <div className="text-lg font-bold text-blue-600">{backup.data.inspections.length}</div>
                        <div className="text-[10px] uppercase text-gray-500">Inspeções</div>
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-blue-200 text-center">
                        <div className="text-lg font-bold text-blue-600">{backup.data.responses.length}</div>
                        <div className="text-[10px] uppercase text-gray-500">Respostas</div>
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-blue-200 text-center">
                        <div className="text-lg font-bold text-blue-600">{backup.data.photos.length}</div>
                        <div className="text-[10px] uppercase text-gray-500">Fotos</div>
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-blue-200 text-center">
                        <div className="text-lg font-bold text-blue-600">{backup.data.schedules.length}</div>
                        <div className="text-[10px] uppercase text-gray-500">Agendamentos</div>
                    </div>
                </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
                <CardTitle className="text-amber-800 text-base flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Protocolo de Segurança (Rollback)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-amber-800">
                Antes de começar o processo de mesclagem, é vital que você crie uma cópia de segurança do seu estado atual. 
                Se algo sair errado, você terá o arquivo para restaurar tudo como estava.
              </p>
              <Button 
                variant={backupDone ? "outline" : "default"} 
                className={backupDone ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-600 hover:bg-amber-700"}
                onClick={handleSafetyBackup}
              >
                {backupDone ? <><CheckCircle className="mr-2 h-4 w-4" /> Backup Gerado!</> : <><Download className="mr-2 h-4 w-4" /> Criar Backup de Segurança (Rollback)</>}
              </Button>
            </CardContent>
          </Card>

          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-bold">2. Consolidar Inspeções</h2>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
                <p>🚀 <strong>O que vai acontecer:</strong></p>
                <ul className="list-disc ml-5 space-y-1">
                    <li>Clientes com o <strong>mesmo CNPJ ou Nome</strong> serão mesclados.</li>
                    <li>Inspeções na <strong>mesma data</strong> serão unificadas em uma só.</li>
                    <li>As respostas da Ana (Nutrição) serão adicionadas à sua inspeção local.</li>
                    <li>Tudo será enviado para a nuvem automaticamente ao final.</li>
                </ul>
            </div>

            <Button 
                className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-lg shadow-lg"
                disabled={isProcessing}
                onClick={handleConsolidate}
            >
                {isProcessing ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando Consolidação...</>
                ) : (
                    <><Upload className="mr-2 h-5 w-5" /> Iniciar Consolidação Inteligente</>
                )}
            </Button>
          </div>
        </div>
      )}

      {progress.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-gray-400 text-xs uppercase tracking-widest font-mono">Terminal de Migração</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="font-mono text-[10px] sm:text-xs text-green-400 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {progress.map((msg, i) => (
                        <div key={i} className="flex gap-2">
                            <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                            <span>{msg}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}

      {report && (
        <Card className="animate-in fade-in zoom-in duration-300">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Consolidação Concluída!</h2>
                <p className="text-gray-500">As inspeções da Ana e Ester agora fazem parte do seu banco de dados global.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl font-bold text-primary-600">{report.clientsMerged}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Clientes</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl font-bold text-purple-600">{report.inspectionsMerged}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Inspeções Uni.</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl font-bold text-amber-600">{report.responsesMerged}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Respostas</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl font-bold text-blue-600">{report.photosImported}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Fotos</div>
                </div>
            </div>

            <Button className="w-full" size="lg" onClick={() => navigate('/')}>
                Voltar para o Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
