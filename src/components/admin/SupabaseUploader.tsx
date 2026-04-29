'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, UploadCloud, CheckCircle } from 'lucide-react';

interface Props {
  onUpload: (url: string) => void;
  accent?: string;
  buttonText?: string;
}

export default function SupabaseUploader({ onUpload, accent = '#ff69b4', buttonText = 'Upload' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setSuccess(false);

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      
      onUpload(data.publicUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          cursor: uploading ? 'wait' : 'pointer',
          width: '100%',
          zIndex: 10
        }}
      />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 16px',
        borderRadius: '10px',
        background: success ? 'rgba(52,211,153,0.1)' : `${accent}15`,
        border: success ? '1px solid rgba(52,211,153,0.4)' : `1px solid ${accent}40`,
        color: success ? '#34d399' : '#fff',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: 'var(--font-inter)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        boxShadow: success ? '0 0 15px rgba(52,211,153,0.1)' : `0 0 15px ${accent}10`,
        transition: 'all 0.3s ease'
      }}>
        {uploading ? <Loader2 size={14} className="animate-spin" /> : success ? <CheckCircle size={14} /> : <UploadCloud size={14} />}
        {uploading ? 'Uploading...' : success ? 'Uploaded Successfully!' : buttonText}
      </div>
    </div>
  );
}
