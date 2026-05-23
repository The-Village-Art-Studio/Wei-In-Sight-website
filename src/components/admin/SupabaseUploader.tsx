'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, UploadCloud, CheckCircle, Images } from 'lucide-react';

interface SingleProps {
  mode?: 'single';
  onUpload: (url: string) => void;
  onBatchUpload?: never;
  accent?: string;
  buttonText?: string;
}

interface MultiProps {
  mode: 'multi';
  onUpload?: never;
  onBatchUpload: (urls: string[]) => void;
  accent?: string;
  buttonText?: string;
}

type Props = SingleProps | MultiProps;

async function uploadFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('media').getPublicUrl(filePath);
  return data.publicUrl;
}

export default function SupabaseUploader(props: Props) {
  const { accent = '#ff69b4', buttonText } = props;
  const isMulti = props.mode === 'multi';

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      setSuccess(false);

      if (isMulti && files.length > 1) {
        // Multi-file upload
        const urls: string[] = [];
        const total = files.length;

        for (let i = 0; i < total; i++) {
          setProgress(`${i + 1} / ${total}`);
          const url = await uploadFile(files[i]);
          urls.push(url);
        }

        props.onBatchUpload(urls);
      } else {
        // Single file
        setProgress('');
        const url = await uploadFile(files[0]);

        if (isMulti) {
          props.onBatchUpload([url]);
        } else {
          props.onUpload(url);
        }
      }

      setSuccess(true);
      setProgress('');
      setTimeout(() => setSuccess(false), 2500);
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      alert('Error uploading: ' + error.message);
    } finally {
      setUploading(false);
      // Reset input so the same files can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const label = buttonText || (isMulti ? 'Upload Images' : 'Upload');
  const IconComponent = isMulti ? Images : UploadCloud;

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={isMulti}
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
        {uploading
          ? <Loader2 size={14} className="animate-spin" />
          : success
            ? <CheckCircle size={14} />
            : <IconComponent size={14} />
        }
        {uploading
          ? (progress ? `Uploading ${progress}...` : 'Uploading...')
          : success
            ? 'Uploaded Successfully!'
            : label
        }
      </div>
    </div>
  );
}
