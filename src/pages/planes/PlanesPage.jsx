import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle } from 'lucide-react';

const planes = [
  {
    name: 'Starter',
    price: 'Gratis',
    workers: 'Hasta 5 trabajadores',
    features: ['Dashboard basico', 'Liquidaciones', 'Contratos', 'Asistencia'],
    chatLimit: '5 consultas/dia',
  },
  {
    name: 'Pyme',
    price: '$29.990/mes',
    workers: 'Hasta 25 trabajadores',
    features: ['Todo de Starter', 'Cotizaciones previsionales', 'Vacaciones', 'Compliance basico', 'Chat IA: 30 consultas/dia'],
    chatLimit: '30 consultas/dia',
    popular: true,
  },
  {
    name: 'Business',
    price: '$59.990/mes',
    workers: 'Hasta 100 trabajadores',
    features: ['Todo de Pyme', 'Ley Karin completa', 'Documentos RIOHS', 'Finiquitos automaticos', 'Emails inteligentes', 'Chat IA ilimitado'],
    chatLimit: 'Ilimitado',
  },
  {
    name: 'Enterprise',
    price: 'Contactar',
    workers: 'Trabajadores ilimitados',
    features: ['Todo de Business', 'Multi-empresa', 'API dedicada', 'Soporte prioritario', 'Integraciones custom'],
    chatLimit: 'Ilimitado',
  },
];

export default function PlanesPage() {
  const { user } = useAuth();
  const currentPlan = user?.plan || 'STARTER';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F4E79]">Planes</h1>
        <p className="text-sm text-gray-500">Elige el plan que mejor se adapte a tu empresa</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {planes.map(plan => {
          const isCurrent = currentPlan.toUpperCase() === plan.name.toUpperCase();
          return (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-[#0F6E56] border-2' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success">Mas popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="mt-2 text-2xl font-bold text-[#1F4E79]">{plan.price}</p>
                <p className="text-xs text-gray-500">{plan.workers}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 text-[#0F6E56] mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>Plan actual</Button>
                ) : (
                  <Button variant={plan.popular ? 'secondary' : 'outline'} className="w-full">
                    {plan.price === 'Contactar' ? 'Contactar ventas' : 'Cambiar plan'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
