import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { formatDate } from '../../lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/ui/Table';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Alert } from '../../components/ui/Alert';
import { FolderOpen, Upload, FileText, Download } from 'lucide-react';

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingRiohs, setGeneratingRiohs] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get('/api/documentos');
      if (res.success) setDocumentos(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const generarRiohs = async () => {
    setGeneratingRiohs(true); setError('');
    try {
      const res = await api.post('/api/documentos/riohs/generar');
      if (res.success) { setSuccess('RIOHS generado correctamente'); fetchData(); }
      else setError(res.error);
    } catch (e) { setError(e.message); }
    finally { setGeneratingRiohs(false); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipo', 'OTRO');
    try {
      const res = await api.upload('/api/documentos', formData);
      if (res.success) { setSuccess('Documento subido correctamente'); fetchData(); }
      else setError(res.error || 'Error al subir');
    } catch (err) { setError(err.message); }
    e.target.value = '';
  };

  if (loading) return <Loader />;

  const tipoLabel = { CONTRATO: 'Contrato', LIQUIDACION: 'Liquidacion', PROTOCOLO_KARIN: 'Protocolo Karin', RIOHS: 'RIOHS', FINIQUITO: 'Finiquito', OTRO: 'Otro' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4E79]">Documentos</h1>
          <p className="text-sm text-gray-500">Gestion documental de la empresa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generarRiohs} loading={generatingRiohs}>
            <FileText className="mr-2 h-4 w-4" /> Generar RIOHS
          </Button>
          <label>
            <Button variant="secondary" as="span" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" /> Subir documento
            </Button>
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {documentos.length === 0 ? (
        <EmptyState icon={FolderOpen} title="Sin documentos" description="Sube o genera documentos para tu empresa" />
      ) : (
        <Card>
          <CardContent className="pt-4">
            <Table>
              <Thead>
                <tr>
                  <Th>Nombre</Th>
                  <Th>Tipo</Th>
                  <Th>Fecha</Th>
                  <Th>Tamano</Th>
                  <Th></Th>
                </tr>
              </Thead>
              <Tbody>
                {documentos.map(d => (
                  <Tr key={d.id}>
                    <Td className="font-medium">{d.nombre}</Td>
                    <Td><Badge variant="secondary">{tipoLabel[d.tipo] || d.tipo}</Badge></Td>
                    <Td>{formatDate(d.createdAt)}</Td>
                    <Td className="text-xs text-gray-400">{d.tamano ? `${Math.round(d.tamano / 1024)} KB` : '—'}</Td>
                    <Td>
                      {d.url && (
                        <a href={d.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                        </a>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
