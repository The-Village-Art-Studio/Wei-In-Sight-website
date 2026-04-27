'use client';

import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface ImageCropperProps {
  imageSrc: string;
  aspect: number;            // e.g. 21/9, 16/9, or 1 for circle
  cropShape?: 'rect' | 'round';
  onCropComplete: (croppedDataUrl: string) => void;
  onCancel: () => void;
  accent?: string;
}

export default function ImageCropper({
  imageSrc,
  aspect,
  cropShape = 'rect',
  onCropComplete,
  onCancel,
  accent = '#ff69b4',
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((z: number) => {
    setZoom(z);
  }, []);

  const handleCropDone = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = reject;
      });

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // If circular crop, clip to circle
      if (cropShape === 'round') {
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          Math.min(canvas.width, canvas.height) / 2,
          0,
          2 * Math.PI
        );
        ctx.clip();
      }

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const dataUrl = canvas.toDataURL('image/webp', 0.92);
      onCropComplete(dataUrl);
    } catch (err) {
      console.error('Crop failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0,0,0,0.88)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div>
          <div style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'var(--font-inter)',
            marginBottom: '2px',
          }}>
            Image Processing
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#fff',
            fontFamily: 'var(--font-outfit)',
            letterSpacing: '0.04em',
          }}>
            {cropShape === 'round' ? 'Circular Profile Crop' : `Cinematic Crop · ${aspect >= 2 ? '21:9' : '16:9'}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-inter)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing || !croppedAreaPixels}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              background: `${accent}20`,
              border: `1px solid ${accent}50`,
              color: accent,
              cursor: processing ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-inter)',
              letterSpacing: '0.06em',
              opacity: processing ? 0.5 : 1,
            }}
          >
            {processing ? 'Processing…' : 'Apply Crop'}
          </button>
        </div>
      </div>

      {/* Cropper area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={cropShape}
          showGrid={cropShape === 'rect'}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={handleCropDone}
        />
      </div>

      {/* Zoom slider */}
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          fontFamily: 'var(--font-inter)',
          flexShrink: 0,
        }}>
          Zoom
        </span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          style={{
            flex: 1,
            accentColor: accent,
            height: '4px',
          }}
        />
        <span style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'var(--font-inter)',
          minWidth: '36px',
          textAlign: 'right',
        }}>
          {zoom.toFixed(1)}×
        </span>
      </div>
    </div>
  );
}
