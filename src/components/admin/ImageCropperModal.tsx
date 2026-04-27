'use client';

import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { X, Check, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperModalProps {
  imageUrl: string;
  aspect?: number; // e.g. 16/9 for hero, 1 for profile
  isCircular?: boolean;
  onSave: (croppedArea: Area) => void;
  onClose: () => void;
}

export default function ImageCropperModal({
  imageUrl,
  aspect = 16 / 9,
  isCircular = false,
  onSave,
  onClose,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedArea(croppedPixels);
  }, []);

  const handleSave = () => {
    if (croppedArea) onSave(croppedArea);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        width: '90%',
        maxWidth: '640px',
        background: '#0c0c0c',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#ff69b4',
            fontFamily: 'var(--font-inter)',
          }}>
            {isCircular ? 'Crop Profile Photo' : 'Scale & Crop'}
          </span>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)',
            padding: '4px',
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Cropper Area */}
        <div style={{ position: 'relative', width: '100%', height: '380px', background: '#000' }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={isCircular ? 'round' : 'rect'}
            showGrid={!isCircular}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { borderRadius: 0 },
              cropAreaStyle: {
                border: isCircular ? '2px solid rgba(255,105,180,0.6)' : '2px solid rgba(255,255,255,0.3)',
                boxShadow: isCircular ? '0 0 20px rgba(255,105,180,0.2)' : 'none',
              },
            }}
          />
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          {/* Zoom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ZoomOut size={14} color="rgba(255,255,255,0.4)" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              style={{
                width: '140px',
                height: '3px',
                appearance: 'none',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '4px',
                outline: 'none',
                accentColor: '#ff69b4',
              }}
            />
            <ZoomIn size={14} color="rgba(255,255,255,0.4)" />

            <button onClick={handleReset} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontSize: '10px',
              fontFamily: 'var(--font-inter)',
            }}>
              <RotateCcw size={11} /> Reset
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-inter)',
            }}>
              Cancel
            </button>
            <button onClick={handleSave} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '8px',
              background: 'rgba(255,105,180,0.15)',
              border: '1px solid rgba(255,105,180,0.4)',
              color: '#ff69b4',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-inter)',
              fontWeight: 500,
            }}>
              <Check size={13} /> Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
