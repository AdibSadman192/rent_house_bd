import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const NIDVerification = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('nidNumber', data.nidNumber);
      formData.append('dateOfBirth', data.dateOfBirth);
      formData.append('fatherName', data.fatherName);
      formData.append('motherName', data.motherName);
      formData.append('nidFrontImage', frontImage);
      formData.append('nidBackImage', backImage);
      formData.append('permanentAddress', JSON.stringify(data.permanentAddress));
      formData.append('profession', data.profession);
      formData.append('monthlyIncome', data.monthlyIncome);

      const response = await axios.post('/api/v1/documents/nid', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(t('verification.success'));
    } catch (error) {
      toast.error(error.response?.data?.message || t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('errors.fileSize', { size: 5 }));
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error(t('errors.fileType', { types: 'JPG, PNG' }));
        return;
      }
      if (type === 'front') setFrontImage(file);
      else setBackImage(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">{t('verification.nid.label')}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* NID Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('verification.nid.number')}
          </label>
          <input
            type="text"
            {...register('nidNumber', {
              required: t('errors.required'),
              pattern: {
                value: /^[0-9]{10,17}$/,
                message: t('errors.nidFormat')
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.nidNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.nidNumber.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('verification.nid.dateOfBirth')}
          </label>
          <input
            type="date"
            {...register('dateOfBirth', { required: t('errors.required') })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Parents Names */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('verification.nid.fatherName')}
            </label>
            <input
              type="text"
              {...register('fatherName', { required: t('errors.required') })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('verification.nid.motherName')}
            </label>
            <input
              type="text"
              {...register('motherName', { required: t('errors.required') })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* NID Images */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('verification.nid.front')}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleImageChange(e, 'front')}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('verification.nid.back')}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleImageChange(e, 'back')}
              className="mt-1 block w-full"
              required
            />
          </div>
        </div>

        {/* Profession and Income */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('verification.profession')}
            </label>
            <input
              type="text"
              {...register('profession', { required: t('errors.required') })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('verification.monthlyIncome')}
            </label>
            <input
              type="number"
              {...register('monthlyIncome', {
                required: t('errors.required'),
                min: { value: 0, message: t('errors.invalidAmount') }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('common.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NIDVerification;
