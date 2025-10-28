import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-[#85daff]" />,
      title: 'Blockchain Security',
      description: 'Degrees stored immutably on Sui blockchain, ensuring authenticity and preventing fraud'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-[#22c55e]" />,
      title: 'Instant Verification',
      description: 'Verify any degree certificate in seconds with just the student ID'
    },
    {
      icon: <Clock className="w-8 h-8 text-[#85daff]" />,
      title: 'Real-time Updates',
      description: 'Degree status updates automatically including revocations and modifications'
    },
    {
      icon: <Users className="w-8 h-8 text-[#85daff]" />,
      title: 'Multi-University Support',
      description: 'Supporting multiple educational institutions on a single platform'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[#1b1b1b] mb-6">
            Verify Degrees
            <span className="block text-[#85daff]">Instantly</span>
          </h1>
          <p className="text-xl text-[#4b5563] mb-8 max-w-2xl mx-auto leading-relaxed">
            Decentralized degree verification on Sui blockchain. 
            Transparent, tamper-proof, and instantly verifiable certificates.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            size="lg" 
            onClick={() => navigate('/verify')}
            className="group"
          >
            Verify Degree Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/verify')}
          >
            Learn More
          </Button>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1b1b1b] mb-4">
            Why Choose DigiDegree?
          </h2>
          <p className="text-lg text-[#4b5563] max-w-2xl mx-auto">
            Built with cutting-edge blockchain technology to ensure your academic credentials are secure and verifiable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <Card hover className="text-center h-full">
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1b1b1b] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#4b5563] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="text-center py-16 px-8 bg-gradient-to-r from-[#85daff] to-[#4facfe] rounded-3xl text-white"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of institutions and individuals who trust DigiDegree for secure degree verification
        </p>
        <Button 
          variant="secondary" 
          size="lg"
          onClick={() => navigate('/verify')}
          className="bg-white text-[#85daff] hover:bg-gray-50"
        >
          Start Verifying Today
        </Button>
      </motion.section>
    </div>
  );
};