import { PieChart } from 'lucide-react';

export function FinanceReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Finance Report</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <PieChart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Coming Soon</h3>
        <p className="mt-1 text-gray-500">
          Generate comprehensive financial reports and analyze your property management business performance.
        </p>
      </div>
    </div>
  );
}