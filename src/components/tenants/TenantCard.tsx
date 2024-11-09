import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TenantCardProps {
  unitId: string;
  onAddTenant: () => void;
}

interface Tenant {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  national_id: string;
  status: 'active' | 'inactive' | 'blacklisted';
}

export function TenantCard({ unitId, onAddTenant }: TenantCardProps) {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        // First get the active contract for this unit
        const { data: contract } = await supabase
          .from('contracts')
          .select('tenant_id')
          .eq('unit_id', unitId)
          .eq('status', 'active')
          .single();

        if (contract?.tenant_id) {
          // Then get the tenant details
          const { data: tenantData } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', contract.tenant_id)
            .single();

          setTenant(tenantData);
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [unitId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Tenant</h2>
        <div className="text-center py-6">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tenant</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add a tenant to start managing this unit
          </p>
          <div className="mt-6">
            <button
              onClick={onAddTenant}
              className="btn btn-primary flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Tenant</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Current Tenant</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{tenant.full_name}</h3>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                tenant.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : tenant.status === 'blacklisted'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {tenant.status}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>{tenant.phone}</span>
            </div>
            {tenant.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>{tenant.email}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(`/tenants/${tenant.id}`)}
            className="w-full btn btn-secondary mt-4"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}