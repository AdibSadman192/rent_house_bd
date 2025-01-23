import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RentalAgreement = ({ property, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [witnesses, setWitnesses] = useState([{ name: '', nidNumber: '', address: '', phone: '' }]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const addWitness = () => {
    if (witnesses.length < 4) {
      setWitnesses([...witnesses, { name: '', nidNumber: '', address: '', phone: '' }]);
    }
  };

  const removeWitness = (index) => {
    if (witnesses.length > 1) {
      const newWitnesses = witnesses.filter((_, i) => i !== index);
      setWitnesses(newWitnesses);
    }
  };

  const updateWitness = (index, field, value) => {
    const newWitnesses = [...witnesses];
    newWitnesses[index][field] = value;
    setWitnesses(newWitnesses);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const agreementData = {
        ...data,
        property: property._id,
        witnesses,
        agreementLanguage: data.agreementLanguage || 'both',
        utilities: {
          electricity: data.electricityIncluded,
          water: data.waterIncluded,
          gas: data.gasIncluded
        },
        monthlyCharges: [
          {
            type: 'service_charge',
            amount: data.serviceCharge,
            description: t('agreement.charges.service')
          },
          {
            type: 'maintenance',
            amount: data.maintenanceCharge,
            description: t('agreement.charges.maintenance')
          }
        ].filter(charge => charge.amount > 0)
      };

      const response = await axios.post('/api/v1/documents/agreement', agreementData);
      
      toast.success(t('agreement.success'));
      onSuccess?.(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">{t('agreement.create')}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Agreement Type and Language */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.type')}
            </label>
            <select
              {...register('agreementType', { required: t('errors.required') })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="residential">{t('agreement.type.residential')}</option>
              <option value="commercial">{t('agreement.type.commercial')}</option>
              <option value="mess_hostel">{t('agreement.type.mess_hostel')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.language')}
            </label>
            <select
              {...register('agreementLanguage')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="both">{t('agreement.language.both')}</option>
              <option value="english">{t('agreement.language.english')}</option>
              <option value="bengali">{t('agreement.language.bengali')}</option>
            </select>
          </div>
        </div>

        {/* Dates and Duration */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.startDate')}
            </label>
            <input
              type="date"
              {...register('startDate', { required: t('errors.required') })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.endDate')}
            </label>
            <input
              type="date"
              {...register('endDate', { required: t('errors.required') })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.noticeRequired')}
            </label>
            <select
              {...register('noticeRequired')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {[1, 2, 3, 4, 5, 6].map(months => (
                <option key={months} value={months}>
                  {months} {t('common.months')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.rentAmount')}
            </label>
            <input
              type="number"
              {...register('rentAmount', {
                required: t('errors.required'),
                min: { value: 0, message: t('errors.invalidAmount') }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.securityDeposit')}
            </label>
            <input
              type="number"
              {...register('securityDeposit', {
                required: t('errors.required'),
                min: { value: 0, message: t('errors.invalidAmount') }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.advanceMonths')}
            </label>
            <select
              {...register('advancePayment.months', { required: t('errors.required') })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {[1, 2, 3, 4, 5, 6, 12].map(months => (
                <option key={months} value={months}>
                  {months} {t('common.months')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Utilities */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.utilities.electricity')}
            </label>
            <select
              {...register('electricityIncluded')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="included">{t('agreement.utilities.included')}</option>
              <option value="excluded">{t('agreement.utilities.excluded')}</option>
              <option value="shared">{t('agreement.utilities.shared')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.utilities.water')}
            </label>
            <select
              {...register('waterIncluded')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="included">{t('agreement.utilities.included')}</option>
              <option value="excluded">{t('agreement.utilities.excluded')}</option>
              <option value="shared">{t('agreement.utilities.shared')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.utilities.gas')}
            </label>
            <select
              {...register('gasIncluded')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="included">{t('agreement.utilities.included')}</option>
              <option value="excluded">{t('agreement.utilities.excluded')}</option>
              <option value="shared">{t('agreement.utilities.shared')}</option>
              <option value="not_applicable">{t('agreement.utilities.notApplicable')}</option>
            </select>
          </div>
        </div>

        {/* Monthly Charges */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.charges.service')}
            </label>
            <input
              type="number"
              {...register('serviceCharge', { min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('agreement.charges.maintenance')}
            </label>
            <input
              type="number"
              {...register('maintenanceCharge', { min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Witnesses */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{t('agreement.witnesses')}</h3>
            <button
              type="button"
              onClick={addWitness}
              disabled={witnesses.length >= 4}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {t('agreement.witness.add')}
            </button>
          </div>

          {witnesses.map((witness, index) => (
            <div key={index} className="p-4 border rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  {t('agreement.witness.title')} #{index + 1}
                </h4>
                {witnesses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWitness(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t('common.remove')}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('agreement.witness.name')}
                  </label>
                  <input
                    type="text"
                    value={witness.name}
                    onChange={(e) => updateWitness(index, 'name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('agreement.witness.nid')}
                  </label>
                  <input
                    type="text"
                    value={witness.nidNumber}
                    onChange={(e) => updateWitness(index, 'nidNumber', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('agreement.witness.address')}
                  </label>
                  <input
                    type="text"
                    value={witness.address}
                    onChange={(e) => updateWitness(index, 'address', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('agreement.witness.phone')}
                  </label>
                  <input
                    type="tel"
                    value={witness.phone}
                    onChange={(e) => updateWitness(index, 'phone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? t('common.processing') : t('agreement.create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RentalAgreement;
