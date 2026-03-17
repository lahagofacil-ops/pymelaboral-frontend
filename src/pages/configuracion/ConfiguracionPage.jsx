import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Loader } from '../../components/ui/Loader';
import { Alert } from '../../components/ui/Alert';
import { Tabs } from '../../components/ui/Tabs';
import { Settings, Building2, Users, Mail } from 'lucide-react';

function EmpresaTab() {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/empresa');
        if (res.success) setEmpresa(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const save = async () => {
    setSaving(true); setMessage(null);
    try {
      const res = await api.put('/api/empresa', empresa);
      if (res.success) setMessage({ type: 'success', text: 'Datos guardados correctamente' });
      else setMessage({ type: 'error', text: res.error });
    } catch (e) { setMessage({ type: 'error', text: e.message }); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader />;
  if (!empresa) return null;

  const set = (key) => (e) => setEmpresa({ ...empresa, [key]: e.target.value });

  return (
    <div className="space-y-4">
      {message && <Alert variant={message.type === 'success' ? 'success' : 'error'}>{message.text}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Razon social" value={empresa.razonSocial || ''} onChange={set('razonSocial')} />
        <Input label="RUT" value={empresa.rut || ''} onChange={set('rut')} disabled />
        <Input label="Direccion" value={empresa.direccion || ''} onChange={set('direccion')} />
        <Input label="Comuna" value={empresa.comuna || ''} onChange={set('comuna')} />
        <Input label="Telefono" value={empresa.telefono || ''} onChange={set('telefono')} />
        <Input label="Email" value={empresa.email || ''} onChange={set('email')} />
        <Select label="Mutualidad" value={empresa.mutualidad || ''} onChange={set('mutualidad')} placeholder="Seleccionar" options={[{ value: 'ACHS', label: 'ACHS' }, { value: 'MUTUAL', label: 'Mutual de Seguridad' }, { value: 'IST', label: 'IST' }, { value: 'ISL', label: 'ISL' }]} />
        <Select label="Gratificacion" value={empresa.sistemaGratificacion || ''} onChange={set('sistemaGratificacion')} options={[{ value: 'ART50', label: 'Art. 50 - Tope 25%' }, { value: 'ART47', label: 'Art. 47 - Reparto' }]} />
      </div>
      <div className="flex justify-end">
        <Button variant="secondary" onClick={save} loading={saving}>Guardar cambios</Button>
      </div>
    </div>
  );
}

function UsuariosTab() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [vinculando, setVinculando] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/empresa/usuarios');
        if (res.success) setUsuarios(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const vincular = async () => {
    setVinculando(true); setMessage(null);
    try {
      const res = await api.post('/api/empresa/usuarios/vincular', { email });
      if (res.success) {
        setMessage({ type: 'success', text: 'Usuario vinculado correctamente' });
        setEmail('');
        const usrRes = await api.get('/api/empresa/usuarios');
        if (usrRes.success) setUsuarios(usrRes.data);
      } else setMessage({ type: 'error', text: res.error });
    } catch (e) { setMessage({ type: 'error', text: e.message }); }
    finally { setVinculando(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      {message && <Alert variant={message.type === 'success' ? 'success' : 'error'}>{message.text}</Alert>}
      <div className="flex gap-2">
        <Input placeholder="email@usuario.cl" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
        <Button variant="secondary" onClick={vincular} loading={vinculando}>Vincular usuario</Button>
      </div>
      <div className="space-y-2">
        {usuarios.map(u => (
          <div key={u.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
            <div>
              <p className="text-sm font-medium">{u.nombre}</p>
              <p className="text-xs text-gray-500">{u.email} · {u.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConfiguracionPage() {
  const tabs = [
    { key: 'empresa', label: 'Empresa', content: <EmpresaTab /> },
    { key: 'usuarios', label: 'Usuarios', content: <UsuariosTab /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F4E79]">Configuracion</h1>
        <p className="text-sm text-gray-500">Administra tu empresa y usuarios</p>
      </div>
      <Card>
        <CardContent className="pt-4">
          <Tabs tabs={tabs} defaultTab="empresa" />
        </CardContent>
      </Card>
    </div>
  );
}
