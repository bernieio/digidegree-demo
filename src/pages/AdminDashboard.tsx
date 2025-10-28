import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Plus, FileText, AlertTriangle, CheckCircle, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ADMIN_ADDRESS } from '../lib/constants';

// Mock data for demonstration
const mockDegrees = [
  {
    id: '1',
    student_id: '20215001',
    student_name: 'Nguyen Van A',
    degree_type: 'Bachelor of Engineering',
    major: 'Computer Science',
    issued_date: '2025-01-15',
    status: 'valid' as const,
    tx_hash: '0xabc123...'
  },
  {
    id: '2',
    student_id: '20215002',
    student_name: 'Tran Thi B',
    degree_type: 'Bachelor of Science',
    major: 'Information Technology',
    issued_date: '2025-01-14',
    status: 'valid' as const,
    tx_hash: '0xdef456...'
  },
  {
    id: '3',
    student_id: '20215003',
    student_name: 'Le Van C',
    degree_type: 'Master of Science',
    major: 'Data Science',
    issued_date: '2025-01-13',
    status: 'revoked' as const,
    tx_hash: '0xghi789...'
  }
];

export const AdminDashboard: React.FC = () => {
  const account = useCurrentAccount();
  const navigate = useNavigate();
  const [degrees, setDegrees] = useState(mockDegrees);
  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    revoked: 0,
    thisMonth: 0
  });

  const isAdmin = account?.address === ADMIN_ADDRESS;

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Calculate stats
    const total = degrees.length;
    const valid = degrees.filter(d => d.status === 'valid').length;
    const revoked = degrees.filter(d => d.status === 'revoked').length;
    const thisMonth = degrees.filter(d => {
      const issueDate = new Date(d.issued_date);
      const now = new Date();
      return issueDate.getMonth() === now.getMonth() && 
             issueDate.getFullYear() === now.getFullYear();
    }).length;

    setStats({ total, valid, revoked, thisMonth });
  }, [degrees, isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">Access Denied</h2>
        <p className="text-[#4b5563]">You need admin privileges to access this page.</p>
      </div>
    );
  }

  const handleRevoke = async (studentId: string) => {
    if (!confirm(`Are you sure you want to revoke the degree for student ID: ${studentId}?`)) {
      return;
    }

    try {
      // TODO: Implement actual revoke API call
      // await apiClient.revokeDegree(studentId);
      
      setDegrees(prev => prev.map(d => 
        d.student_id === studentId ? { ...d, status: 'revoked' as const } : d
      ));
      
      // Show success message (implement toast/notification system)
      alert('Degree revoked successfully');
    } catch (error) {
      console.error('Failed to revoke degree:', error);
      alert('Failed to revoke degree');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#1b1b1b] mb-2">
            Admin Dashboard
          </h1>
          <p className="text-[#4b5563]">
            Manage and monitor degree certificates
          </p>
        </div>
        <Button onClick={() => navigate('/admin/mint')} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Mint New Degree
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#e0f6ff] rounded-xl">
              <FileText className="w-6 h-6 text-[#85daff]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1b1b1b]">{stats.total}</p>
              <p className="text-sm text-[#4b5563]">Total Degrees</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1b1b1b]">{stats.valid}</p>
              <p className="text-sm text-[#4b5563]">Valid Degrees</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1b1b1b]">{stats.revoked}</p>
              <p className="text-sm text-[#4b5563]">Revoked</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1b1b1b]">{stats.thisMonth}</p>
              <p className="text-sm text-[#4b5563]">This Month</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Degrees Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1b1b1b]">
              Recent Degrees
            </h2>
            <div className="flex items-center space-x-2 text-sm text-[#4b5563]">
              <Users className="w-4 h-4" />
              <span>{degrees.length} total</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-[#4b5563]">Student ID</th>
                  <th className="text-left py-3 px-4 font-medium text-[#4b5563]">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-[#4b5563]">Degree</th>
                  <th className="text-left py-3 px-4 font-medium text-[#4b5563]">Major</th>
                  <th className="text-left py-3 px-4 font-medium text-[#4b5563]">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-[#4b5563]">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-[#4b5563]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {degrees.map((degree, index) => (
                  <motion.tr 
                    key={degree.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {degree.student_id}
                      </code>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#1b1b1b]">
                      {degree.student_name}
                    </td>
                    <td className="py-3 px-4 text-[#4b5563]">
                      {degree.degree_type}
                    </td>
                    <td className="py-3 px-4 text-[#4b5563]">
                      {degree.major}
                    </td>
                    <td className="py-3 px-4 text-[#4b5563]">
                      {degree.issued_date}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={degree.status} />
                    </td>
                    <td className="py-3 px-4">
                      {degree.status === 'valid' ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRevoke(degree.student_id)}
                        >
                          Revoke
                        </Button>
                      ) : (
                        <span className="text-[#4b5563] text-sm">Revoked</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {degrees.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-[#4b5563] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-[#1b1b1b] mb-2">
                No degrees found
              </h3>
              <p className="text-[#4b5563] mb-4">
                Start by minting your first degree certificate
              </p>
              <Button onClick={() => navigate('/admin/mint')}>
                <Plus className="w-4 h-4 mr-2" />
                Mint First Degree
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};