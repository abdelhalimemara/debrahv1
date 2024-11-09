import { useEffect, useState } from 'react';
import { Building2, Home, Users, FileText, Wallet } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentOwners } from '../components/dashboard/RecentOwners';
import { VacancyChart } from '../components/dashboard/VacancyChart';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalOwners: number;
  totalBuildings: number;
  totalUnits: number;
  totalTenants: number;
  vacancyRate: number;
  activeContracts: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOwners: 0,
    totalBuildings: 0,
    totalUnits: 0,
    totalTenants: 0,
    vacancyRate: 0,
    activeContracts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        // Fetch counts from each table
        const [
          { count: ownersCount },
          { count: buildingsCount },
          { count: unitsCount },
          { count: tenantsCount },
          { count: activeContractsCount },
          { count: vacantUnitsCount },
        ] = await Promise.all([
          supabase.from('owners').select('*', { count: 'exact', head: true }).eq('office_id', officeId),
          supabase.from('buildings').select('*', { count: 'exact', head: true }).eq('office_id', officeId),
          supabase.from('units').select('*', { count: 'exact', head: true }).eq('office_id', officeId),
          supabase.from('tenants').select('*', { count: 'exact', head: true }).eq('office_id', officeId),
          supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('office_id', officeId).eq('status', 'active'),
          supabase.from('units').select('*', { count: 'exact', head: true }).eq('office_id', officeId).eq('status', 'vacant'),
        ]);

        const vacancyRate = unitsCount ? Math.round((vacantUnitsCount / unitsCount) * 100) : 0;

        setStats({
          totalOwners: ownersCount || 0,
          totalBuildings: buildingsCount || 0,
          totalUnits: unitsCount || 0,
          totalTenants: tenantsCount || 0,
          vacancyRate,
          activeContracts: activeContractsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Property Owners"
          value={stats.totalOwners}
          icon={Users}
        />
        <StatCard
          label="Buildings"
          value={stats.totalBuildings}
          icon={Building2}
        />
        <StatCard
          label="Total Units"
          value={stats.totalUnits}
          icon={Home}
          trend={`${stats.vacancyRate}% Vacant`}
          trendDirection={stats.vacancyRate > 20 ? 'down' : 'up'}
        />
        <StatCard
          label="Active Contracts"
          value={stats.activeContracts}
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VacancyChart />
        <RecentOwners />
      </div>
    </div>
  );
}