import React, { useRef, useEffect, useState } from 'react';

export default function ScratchCanvas({ coverImage, onComplete }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Load cover image
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = coverImage;
    img.onload = () => {
      // Draw image covering the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    // Calculate clear percentage
    const checkClearPercentage = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let clearPixels = 0;
      
      // Step by 4 to check alpha channel
      for(let i = 3; i < data.length; i += 4) {
        if(data[i] === 0) clearPixels++;
      }
      
      const clearPercentage = clearPixels / (data.length / 4);
      if (clearPercentage > 0.4 && !isCleared) {
        setIsCleared(true);
        if (onComplete) onComplete();
      }
    };

    const getCoordinates = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      let clientX, clientY;
      
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    const scratch = (e) => {
      if (!isDrawing || isCleared) return;
      e.preventDefault(); // Prevent scrolling on touch
      
      const { x, y } = getCoordinates(e);
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2, false);
      ctx.fill();
      
      // Check clear percentage occasionally
      if (Math.random() < 0.1) checkClearPercentage();
    };

    const startDrawing = (e) => {
      setIsDrawing(true);
      scratch(e);
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      checkClearPercentage();
    };

    // Resize canvas to match display size
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (img.complete) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', scratch);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [coverImage, isDrawing, isCleared, onComplete]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        opacity: isCleared ? 0 : 1,
        transition: 'opacity 1s ease',
        pointerEvents: isCleared ? 'none' : 'auto',
        touchAction: 'none'
      }}
    />
  );
}
