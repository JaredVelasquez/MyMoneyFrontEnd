import FeatureCard from '../ui/FeatureCard';
import SectionTitle from '../ui/SectionTitle';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  DevicePhoneMobileIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const features = [
    {
      id: '1',
      icon: <CurrencyDollarIcon className="h-6 w-6" />,
      title: 'Control de gastos',
      description: 'Registra y categoriza todos tus gastos e ingresos para saber exactamente dónde va tu dinero.'
    },
    {
      id: '2',
      icon: <ChartBarIcon className="h-6 w-6" />,
      title: 'Reportes intuitivos',
      description: 'Visualiza gráficos y estadísticas para entender mejor tus hábitos financieros.'
    },
    {
      id: '3',
      icon: <DevicePhoneMobileIcon className="h-6 w-6" />,
      title: 'Gestión desde cualquier dispositivo',
      description: 'Accede a tu información financiera desde tu computadora, tablet o teléfono móvil.'
    },
    {
      id: '4',
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      title: 'Seguridad garantizada',
      description: 'Tu información financiera está protegida con los más altos estándares de seguridad.'
    },
    {
      id: '5',
      icon: <SparklesIcon className="h-6 w-6" />,
      title: 'Plan Premium',
      description: 'Desbloquea funcionalidades avanzadas como reconocimiento de imágenes y entrada por voz.',
      bgColor: 'bg-amber-50',
      iconBgColor: 'bg-amber-100',
      iconColor: 'text-amber-500'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          title="Todo lo que necesitas para gestionar tus finanzas"
          subtitle="Diseñado para ayudarte a tomar el control de tu dinero"
        />

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                bgColor={feature.bgColor}
                iconBgColor={feature.iconBgColor}
                iconColor={feature.iconColor}
              />
            ))}

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white transition-transform duration-300 hover:scale-105">
              <h3 className="text-lg font-medium">¿Listo para tomar control?</h3>
              <p className="mt-2 text-blue-100">
                Regístrate hoy mismo y comienza a mejorar tu salud financiera.
              </p>
              <Link
                to="/register"
                className="mt-4 inline-flex items-center text-sm font-medium text-white hover:underline"
              >
                Crear cuenta gratuita
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection; 