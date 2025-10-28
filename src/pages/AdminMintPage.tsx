import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, AlertTriangle, CheckCircle, FileText, QrCode } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { apiClient } from '../lib/api';
import { ADMIN_ADDRESS } from '../lib/constants';

interface MintFormData {
  student_id: string;
  full_name: string;
  degree_type: string;
  major: string;
  issued_date: string;
  issuer: string;
}

interface MintResult {
  success: boolean;
  tx_hash?: string;
  walrus_uri?: string;
  error?: string;
}

export const AdminMintPage: React.FC = () => {
  const account = useCurrentAccount();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MintResult | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<MintFormData>({
    defaultValues: {
      issuer: 'HCMUTE',
      issued_date: new Date().toISOString().split('T')[0]
    }
  });

  const isAdmin = account?.address === ADMIN_ADDRESS;

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">Access Denied</h2>
        <p className="text-[#4b5563]">You need admin privileges to access this page.</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Go Home
        </Button>
      </div>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: MintFormData) => {
    if (!selectedFile) {
      alert('Please select a certificate image');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('metadata', JSON.stringify(data));
      formData.append('student_id', data.student_id);

      const response = await apiClient.issueDegree(formData);
      
      setResult({
        success: true,
        tx_hash: response.tx_hash,
        walrus_uri: response.walrus_uri
      });

      // Reset form
      reset();
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Mint error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mint degree'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateVerifyUrl = (studentId: string) => {
    return `${window.location.origin}/verify?student_id=${studentId}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#1b1b1b] mb-4">
          Mint New Degree
        </h1>
        <p className="text-lg text-[#4b5563]">
          Issue a new blockchain-verified degree certificate
        </p>
      </motion.div>

      {/* Success Result */}
      {result?.success && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-green-50 border-green-200">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <h2 className="text-xl font-semibold text-green-800">
                Degree Minted Successfully!
              </h2>
              <div className="space-y-2 text-sm">
                <p>Transaction Hash: <code className="bg-white px-2 py-1 rounded">{result.tx_hash}</code></p>
                {result.walrus_uri && (
                  <p>Walrus URI: <code className="bg-white px-2 py-1 rounded">{result.walrus_uri}</code></p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/admin/dashboard')}
                >
                  View Dashboard
                </Button>
                <Button onClick={() => setResult(null)}>
                  Mint Another
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Error Result */}
      {result?.error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-red-50 border-red-200">
            <div className="text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-red-600 mx-auto" />
              <h2 className="text-xl font-semibold text-red-800">
                Minting Failed
              </h2>
              <p className="text-red-600">{result.error}</p>
              <Button 
                variant="danger" 
                onClick={() => setResult(null)}
              >
                Try Again
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Mint Form */}
      {!result?.success && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-[#1b1b1b] mb-2">
                  Certificate Image *
                </label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#85daff] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-[#4b5563] mx-auto" />
                    {selectedFile ? (
                      <div>
                        <p className="text-sm font-medium text-[#1b1b1b]">{selectedFile.name}</p>
                        <p className="text-xs text-[#4b5563]">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-[#1b1b1b]">
                          Click to upload certificate image
                        </p>
                        <p className="text-xs text-[#4b5563]">
                          PNG, JPG, WebP up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="student_id" className="block text-sm font-medium text-[#1b1b1b] mb-2">
                    Student ID *
                  </label>
                  <input
                    {...register('student_id', { 
                      required: 'Student ID is required',
                      pattern: {
                        value: /^[0-9A-Za-z]+$/,
                        message: 'Invalid student ID format'
                      }
                    })}
                    type="text"
                    placeholder="e.g., 20215001"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#85daff] focus:border-transparent"
                    disabled={isLoading}
                  />
                  {errors.student_id && (
                    <p className="text-red-600 text-sm mt-1">{errors.student_id.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-[#1b1b1b] mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('full_name', { required: 'Full name is required' })}
                    type="text"
                    placeholder="e.g., Nguyen Van A"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#85daff] focus:border-transparent"
                    disabled={isLoading}
                  />
                  {errors.full_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="degree_type" className="block text-sm font-medium text-[#1b1b1b] mb-2">
                    Degree Type *
                  </label>
                  <select
                    {...register('degree_type', { required: 'Degree type is required' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#85daff] focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="">Select degree type</option>
                    <option value="Bachelor of Engineering">Bachelor of Engineering</option>
                    <option value="Bachelor of Science">Bachelor of Science</option>
                    <option value="Master of Science">Master of Science</option>
                    <option value="Master of Engineering">Master of Engineering</option>
                    <option value="Doctor of Philosophy">Doctor of Philosophy</option>
                  </select>
                  {errors.degree_type && (
                    <p className="text-red-600 text-sm mt-1">{errors.degree_type.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="major" className="block text-sm font-medium text-[#1b1b1b] mb-2">
                    Major *
                  </label>
                  <input
                    {...register('major', { required: 'Major is required' })}
                    type="text"
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#85daff] focus:border-transparent"
                    disabled={isLoading}
                  />
                  {errors.major && (
                    <p className="text-red-600 text-sm mt-1">{errors.major.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="issued_date" className="block text-sm font-medium text-[#1b1b1b] mb-2">
                    Issue Date *
                  </label>
                  <input
                    {...register('issued_date', { required: 'Issue date is required' })}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#85daff] focus:border-transparent"
                    disabled={isLoading}
                  />
                  {errors.issued_date && (
                    <p className="text-red-600 text-sm mt-1">{errors.issued_date.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="issuer" className="block text-sm font-medium text-[#1b1b1b] mb-2">
                    Issuer *
                  </label>
                  <input
                    {...register('issuer', { required: 'Issuer is required' })}
                    type="text"
                    placeholder="e.g., HCMUTE"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#85daff] focus:border-transparent"
                    disabled={isLoading}
                  />
                  {errors.issuer && (
                    <p className="text-red-600 text-sm mt-1">{errors.issuer.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  isLoading={isLoading}
                  disabled={!selectedFile}
                >
                  {isLoading ? 'Minting Degree...' : 'Mint Degree'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}
    </div>
  );
};