import { FileText, Calendar, Wallet, Edit } from 'lucide-react';
import { Contract } from '../../types';
import { useState } from 'react';
import { EditContractModal } from './EditContractModal';

interface ContractInformationProps {
  contract: Contract;
  onContractUpdate?: () => void;
}

export function ContractInformation({ contract, onContractUpdate }: ContractInformationProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getPaymentFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'annual': return 'Annually (Once a year)';
      case 'semi-annual': return 'Semi-Annually (Twice a year)';
      case 'quarterly': return 'Quarterly (Four times a year)';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  };

  const getMonthlyEquivalent = (rentAmount: number) => {
    return (rentAmount / 12).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Contract Information</h2>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <FileText className="w-5 h-5 mr-3 text-gray-400" />
                <span>Contract #{contract.id.slice(0, 8)}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <span>
                  {new Date(contract.start_date).toLocaleDateString()} - {' '}
                  {new Date(contract.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Wallet className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="font-medium">SAR {contract.rent_amount.toLocaleString()} / year</p>
                  <p className="text-sm text-gray-500">
                    SAR {getMonthlyEquivalent(contract.rent_amount)} / month
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <span>Paid {getPaymentFrequencyLabel(contract.payment_frequency)}</span>
              </div>
              {contract.security_deposit && (
                <div className="flex items-center text-gray-700">
                  <Wallet className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Security Deposit: SAR {contract.security_deposit.toLocaleString()}</span>
                </div>
              )}
              {contract.insurance_fee && (
                <div className="flex items-center text-gray-700">
                  <Wallet className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Insurance Fee: SAR {contract.insurance_fee.toLocaleString()}</span>
                </div>
              )}
              {contract.management_fee && (
                <div className="flex items-center text-gray-700">
                  <Wallet className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Management Fee: SAR {contract.management_fee.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Status</h3>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                contract.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : contract.status === 'expired'
                  ? 'bg-red-100 text-red-800'
                  : contract.status === 'terminated'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {contract.status}
            </span>
          </div>

          {/* Terms and Notes */}
          {contract.terms && Object.keys(contract.terms).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-4">Additional Terms</h3>
              <div className="prose prose-sm max-w-none">
                {Object.entries(contract.terms).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="font-medium">{key}: </span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <EditContractModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          onContractUpdate?.();
        }}
        contract={contract}
      />
    </>
  );
}