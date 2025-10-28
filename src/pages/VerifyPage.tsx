import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Calendar, User, Building2, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { apiClient } from '../lib/api';
import { WALRUS_GATEWAY } from '../lib/constants';

interface DegreeResult {
  valid: boolean;
  degree?: {
    id: string;
    student_id: string;
    issuer: string;
    walrus_uri: string;
    issued_at: string;
    is_revoked: boolean;
  };
  metadata?: {
    student_id: string;
    full_name: string;
    degree_type: string;
    major: string;
    issued_date: string;
    issuer: string;
  };
  error?: string;
}

export const VerifyPage: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DegreeResult | null>(null);
  const [showImage, setShowImage] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const data = await apiClient.verifyDegree(studentId);
      setResult(data);
      
      // Log the verification if successful
      if (data.valid && data.degree && !data.degree.is_revoked) {
        try {
          await apiClient.logVerification(studentId);
        } catch (error) {
          console.warn('Failed to log verification:', error);
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setResult({
        valid: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatus = (): 'valid' | 'revoked' | 'not-found' => {
    if (!result) return 'not-found';
    if (!result.valid) return 'not-found';
    if (result.degree?.is_revoked) return 'revoked';
    return 'valid';
  };

  const formatWalrusUrl = (uri: string) => {
    if (uri.startsWith('walrus://')) {
      const contentId = uri.replace('walrus://', '');
      return `${WALRUS_GATEWAY}/v1/${contentId}`;
    }
    return uri;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-[#1b1b1b] mb-4">
          Verify Academic Degree
        </h1>
        <p className="text-lg text-[#4b5563] max-w-2xl mx-auto">
          Enter a student ID to instantly verify degree authenticity on the Sui blockchain
        </p>
      </motion.div>

      {/* Search Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-[#1b1b1b] mb-2">
                Student ID
              </label>
              <div className="relative">
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter student ID (e.g., 20215001)"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#85daff] focus:border-transparent"
                  disabled={isLoading}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4b5563]" />
              </div>
            </div>
            <Button 
              type="submit" 
              size="lg" 
              isLoading={isLoading}
              className="w-full"
              disabled={!studentId.trim()}
            >
              {isLoading ? 'Verifying...' : 'Verify Degree'}
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="space-y-6">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#1b1b1b] mb-2">
                    Verification Result
                  </h2>
                  <StatusBadge status={getStatus()} />
                </div>
                
                {result.valid && result.degree && (
                  <div className="text-right">
                    <p className="text-sm text-[#4b5563]">Student ID</p>
                    <p className="font-mono text-lg text-[#1b1b1b]">{result.degree.student_id}</p>
                  </div>
                )}
              </div>

              {/* Error State */}
              {result.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600">{result.error}</p>
                </div>
              )}

              {/* Success State */}
              {result.valid && result.degree && result.metadata && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-[#85daff]" />
                        <div>
                          <p className="text-sm text-[#4b5563]">Full Name</p>
                          <p className="font-semibold text-[#1b1b1b]">{result.metadata.full_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-[#85daff]" />
                        <div>
                          <p className="text-sm text-[#4b5563]">Degree Type</p>
                          <p className="font-semibold text-[#1b1b1b]">{result.metadata.degree_type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-[#85daff]" />
                        <div>
                          <p className="text-sm text-[#4b5563]">Issued By</p>
                          <p className="font-semibold text-[#1b1b1b]">{result.metadata.issuer}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-[#85daff]" />
                        <div>
                          <p className="text-sm text-[#4b5563]">Issued Date</p>
                          <p className="font-semibold text-[#1b1b1b]">{result.metadata.issued_date}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Major */}
                  <div className="p-4 bg-[#e0f6ff] rounded-xl">
                    <p className="text-sm text-[#4b5563] mb-1">Major / Specialization</p>
                    <p className="text-lg font-semibold text-[#1b1b1b]">{result.metadata.major}</p>
                  </div>

                  {/* Certificate Image */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#1b1b1b]">
                        Certificate Image
                      </h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowImage(!showImage)}
                      >
                        {showImage ? 'Hide' : 'Show'} Certificate
                      </Button>
                    </div>
                    
                    {showImage && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative"
                      >
                        <img
                          src={formatWalrusUrl(result.degree.walrus_uri)}
                          alt={`Degree certificate for ${result.metadata.full_name}`}
                          className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/api/placeholder/600/400';
                          }}
                        />
                        <a
                          href={formatWalrusUrl(result.degree.walrus_uri)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg hover:bg-white transition-colors"
                        >
                          <ExternalLink className="w-5 h-5 text-[#4b5563]" />
                        </a>
                      </motion.div>
                    )}
                  </div>

                  {/* Revocation Warning */}
                  {result.degree.is_revoked && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <h4 className="font-semibold text-red-800 mb-2">⚠️ This degree has been revoked</h4>
                      <p className="text-red-600">
                        This degree certificate is no longer valid as it has been officially revoked by the issuing institution.
                      </p>
                    </div>
                  )}

                  {/* Blockchain Info */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-[#1b1b1b] mb-2">Blockchain Verification</h4>
                    <div className="text-sm text-[#4b5563] space-y-1">
                      <p>Object ID: <code className="bg-white px-2 py-1 rounded">{result.degree.id}</code></p>
                      <p>Issuer Address: <code className="bg-white px-2 py-1 rounded">{result.degree.issuer}</code></p>
                      <p>Network: Sui Testnet</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};