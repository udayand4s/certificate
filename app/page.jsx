'use client';

import { useState } from 'react';
import { Download, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';     

export default function Home() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    course: 'Psychology 360'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [certificateId, setCertificateId] = useState('');

  const handleEmailSubmit = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
      } else {
        setError(data.error || 'Email not found in our records.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateSubmit = async () => {
    if (!formData.fullName) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName: formData.fullName,
          course: formData.course
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCertificateId(data.certificateId);
        setSuccess(true);
        setStep(3);
      } else {
        setError(data.error || 'Failed to generate certificate.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open(`/api/download-certificate?id=${certificateId}`, '_blank');
  };

  const handleKeyPress = (e, handler) => {
    if (e.key === 'Enter') {
      handler();
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Image
      src="/logo.webp"
      alt="Hero image"
      width={400}
      height={100}
      className="rounded-xl"
    />
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between mb-8">
            <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">Email</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 self-center mx-2"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 self-center mx-2"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">Done</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Verify Your Email</h2>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleEmailSubmit)}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              <button
                onClick={handleEmailSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Certificate Details</h2>
              <div className="mb-6">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  onKeyPress={(e) => handleKeyPress(e, handleCertificateSubmit)}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Psychology 360">Psychology 360</option>
                </select>
              </div>
              <button
                onClick={handleCertificateSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Certificate...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Generate & Send Certificate
                  </>
                )}
              </button>
            </div>
          )}

          {step === 3 && success && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Certificate Sent!</h2>
              <p className="text-gray-600 mb-6">
                Your certificate has been sent to <strong>{email}</strong>
              </p>
              <button
                onClick={handleDownload}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center mb-3"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Certificate
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setEmail('');
                  setFormData({fullName: '', course: 'Psychology 360'});
                  setSuccess(false);
                  setError('');
                  setCertificateId('');
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Generate Another Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}