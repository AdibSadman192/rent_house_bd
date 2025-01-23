import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Image from 'next/image';

const PaymentGateway = ({ amount, propertyId, paymentType, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const paymentGateways = [
    {
      id: 'bkash',
      name: 'bKash',
      logo: '/images/payment/bkash.png',
      description: t('payment.gateway.bkash_desc')
    },
    {
      id: 'nagad',
      name: 'Nagad',
      logo: '/images/payment/nagad.png',
      description: t('payment.gateway.nagad_desc')
    },
    {
      id: 'rocket',
      name: 'Rocket',
      logo: '/images/payment/rocket.png',
      description: t('payment.gateway.rocket_desc')
    }
  ];

  const initializePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/v1/payments/initialize', {
        amount,
        gateway: selectedGateway,
        propertyId,
        paymentType
      });

      // Handle different gateway responses
      switch (selectedGateway) {
        case 'bkash':
          window.location.href = response.data.data.gatewayResponse.redirectURL;
          break;
        case 'nagad':
          // Handle Nagad specific redirect
          break;
        case 'rocket':
          // Handle Rocket specific redirect
          break;
      }

      onSuccess?.(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || t('errors.paymentFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">
        {t('payment.selectGateway')}
      </h2>

      <div className="space-y-4">
        {/* Amount Display */}
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">{t('payment.amount')}</p>
          <p className="text-2xl font-bold">৳ {amount.toLocaleString()}</p>
        </div>

        {/* Payment Gateway Selection */}
        <div className="grid grid-cols-1 gap-4">
          {paymentGateways.map((gateway) => (
            <label
              key={gateway.id}
              className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-colors ${
                selectedGateway === gateway.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="paymentGateway"
                value={gateway.id}
                checked={selectedGateway === gateway.id}
                onChange={(e) => setSelectedGateway(e.target.value)}
                className="hidden"
              />
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={gateway.logo}
                    alt={gateway.name}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div>
                  <p className="font-medium">{gateway.name}</p>
                  <p className="text-sm text-gray-500">{gateway.description}</p>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Payment Instructions */}
        {selectedGateway && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">{t('payment.instructions')}</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              {t(`payment.${selectedGateway}.instructions`, { returnObjects: true }).map(
                (instruction, index) => (
                  <li key={index}>{instruction}</li>
                )
              )}
            </ol>
          </div>
        )}

        {/* Proceed Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={initializePayment}
            disabled={!selectedGateway || loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t('common.processing')}
              </span>
            ) : (
              t('payment.proceed')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
