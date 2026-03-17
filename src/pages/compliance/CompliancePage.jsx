import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const statusIcon = {
  OK: <CheckCircle className="h-5 w-5 text-green-500" />,
  WARNING: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  CRITICAL: <XCircle className="h-5 w-5 text-red-500" />,
};

const statusBadge = { OK: 'success', WARNING: 'warning', CRITICAL: 'destructive' };

export default function CompliancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/api/compliance');
        if (res.success) setData(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <div className="py-12 text-center text-gray-500">No se pudo cargar compliance</div>;

  const score = data.score || 0;
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F4E79]">Compliance Laboral</h1>
        <p className="text-sm text-gray-500">Estado de cumplimiento normativo de tu empresa</p>
      </div>

      {/* Score */}
      <Card>
        <CardContent className="flex items-center justify-between py-8">
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-12 w-12 text-[#1F4E79]" />
            <div>
              <p className="text-sm text-gray-500">Puntaje de cumplimiento</p>
              <p className={`text-4xl font-bold ${scoreColor}`}>{score}%</p>
            </div>
          </div>
          <Badge variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'destructive'}>
            {score >= 80 ? 'Cumple' : score >= 60 ? 'Parcial' : 'Critico'}
          </Badge>
        </CardContent>
      </Card>

      {/* Items */}
      <div className="space-y-3">
        {data.items?.map((item, i) => (
          <Card key={i}>
            <CardContent className="flex items-start gap-4 py-4">
              <div className="mt-0.5">{statusIcon[item.status] || statusIcon.WARNING}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                  <Badge variant={statusBadge[item.status] || 'secondary'} className="text-[10px]">{item.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                {item.action && <p className="mt-1 text-xs text-[#1F4E79] font-medium">{item.action}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
