import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { PayableInformation } from '../../components/payables/PayableInformation';
import { usePayable } from '../../hooks/usePayable';

export function PayableDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { payable, loading, error, refreshPayable } = usePayable(id);

  useEffect(() => {
    if (!id) {
      navigate('/payables');
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !payable) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Payable not found'}</p>
        <Link to="/payables" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Return to Payables
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Payables', href: '/payables' },
    { label: `Receipt ${payable.id.slice(0, 8)}` },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Link to="/payables" className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Receipt Details
          </h1>
        </div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <PayableInformation 
        payable={payable} 
        onPayableUpdate={refreshPayable}
      />
    </div>
  );
}