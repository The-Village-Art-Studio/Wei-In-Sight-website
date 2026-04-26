'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface PulseFormProps {
  formType: 'contact' | 'commission';
}

export default function PulseForm({ formType }: PulseFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    project_type: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formType,
          ...formData
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to connect to the server.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="success-state glass"
      >
        <CheckCircle2 className="success-icon" size={48} />
        <h3>Submission Received</h3>
        <p>Your {formType === 'commission' ? 'request' : 'message'} has been sent to the artist's atlas. Expect a response soon.</p>
        <button onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', phone: '', budget: '', project_type: '', subject: '', message: '' }); }}>
          Send Another
        </button>
      </motion.div>
    );
  }

  return (
    <div className="pulse-form-wrapper">
      <form onSubmit={handleSubmit} className="pulse-form glass">
        <div className="form-grid">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
              placeholder="e.g. Jacky Ho"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
              placeholder="e.g. artist@example.com"
            />
          </div>

          {/* Conditional: Phone (Commissions only) */}
          {formType === 'commission' && (
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                required 
                placeholder="e.g. +1 234 567 8900"
              />
            </div>
          )}

          {/* Conditional: Subject (Contact only) */}
          {formType === 'contact' && (
            <div className="form-group">
              <label htmlFor="subject">Inquiry Subject</label>
              <select 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject...</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Exhibition/Gallery">Exhibition / Gallery</option>
                <option value="Press/Media">Press / Media</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          {/* Conditional: Project Type (Commissions only) */}
          {formType === 'commission' && (
            <div className="form-group">
              <label htmlFor="project_type">Project Focus</label>
              <select 
                id="project_type" 
                name="project_type" 
                value={formData.project_type}
                onChange={handleChange}
                required
              >
                <option value="">Select focus...</option>
                <option value="Painting">Painting</option>
                <option value="Mural">Mural</option>
                <option value="Installation">Installation</option>
                <option value="Fashion">Fashion</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          {/* Conditional: Budget (Commissions only) */}
          {formType === 'commission' && (
            <div className="form-group">
              <label htmlFor="budget">Estimated Budget (USD)</label>
              <input 
                type="text" 
                id="budget" 
                name="budget" 
                value={formData.budget}
                onChange={handleChange}
                required 
                placeholder="e.g. $500 - $1,500"
              />
            </div>
          )}
        </div>

        {/* Message */}
        <div className="form-group full-width">
          <label htmlFor="message">
            {formType === 'commission' ? 'Project Details' : 'Message'}
          </label>
          <textarea 
            id="message" 
            name="message" 
            value={formData.message}
            onChange={handleChange}
            required 
            rows={5}
            placeholder={formType === 'commission' ? 'Describe your vision, requirements, and any specific themes...' : 'How can I help you?'}
          />
        </div>

        {status === 'error' && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <button 
          type="submit" 
          className={`submit-button ${status === 'loading' ? 'loading' : ''}`}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Send {formType === 'commission' ? 'Request' : 'Inquiry'}</span>
            </>
          )}
        </button>
      </form>

      <style jsx>{`
        .pulse-form-wrapper {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .pulse-form {
          padding: 32px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .success-state {
          padding: 60px 40px;
          border-radius: 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .success-icon {
          color: var(--neon-pink);
          filter: drop-shadow(0 0 10px var(--neon-pink-glow));
          margin-bottom: 8px;
        }

        .success-state h3 {
          font-family: var(--font-poetic);
          font-size: 1.5rem;
          letter-spacing: 0.1em;
          color: #fff;
        }

        .success-state p {
          color: var(--gray-subtle);
          max-width: 320px;
          line-height: 1.6;
        }

        .success-state button {
          margin-top: 20px;
          background: rgba(255, 105, 180, 0.15);
          border: 1px solid var(--neon-pink);
          color: var(--neon-pink);
          padding: 10px 24px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .success-state button:hover {
          background: var(--neon-pink);
          color: #000;
          box-shadow: 0 0 20px var(--neon-pink-glow);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gray-subtle);
          padding-left: 4px;
        }

        input, textarea, select {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--neon-pink);
          background: rgba(255, 105, 180, 0.05);
          box-shadow: 0 0 15px rgba(255, 105, 180, 0.1);
        }

        select option {
          background: #111;
          color: #fff;
        }

        .error-banner {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.2);
          color: #ff4d4d;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
        }

        .submit-button {
          margin-top: 12px;
          background: var(--neon-pink);
          color: #000;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .submit-button:hover:not(.loading) {
          transform: translateY(-2px);
          box-shadow: 0 0 25px var(--neon-pink-glow);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .submit-button.loading {
          opacity: 0.7;
          cursor: not-allowed;
          background: #444;
          color: #aaa;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
