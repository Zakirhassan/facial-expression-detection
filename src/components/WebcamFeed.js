import React, { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { loadModels } from '../api/faceApi';

const WebcamFeed = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadAllModels = async () => {
      await loadModels();

      const detect = setInterval(async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          const video = webcamRef.current.video;

          // Get video dimensions
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          // Check if dimensions are valid
          if (videoWidth > 0 && videoHeight > 0) {
            const canvas = canvasRef.current;
            canvas.width = videoWidth;
            canvas.height = videoHeight;

            const displaySize = { width: videoWidth, height: videoHeight };
            faceapi.matchDimensions(canvas, displaySize);

            // Detect faces and expressions
            const detections = await faceapi
              .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceExpressions();

            // Clear canvas before drawing
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw face bounding boxes with custom colors
            if (detections.length > 0) {
              const resizedDetections = faceapi.resizeResults(detections, displaySize);
              
              resizedDetections.forEach(detection => {
                const { x, y, width, height } = detection.detection.box;
                const highestExpression = Object.keys(detection.expressions).reduce((a, b) => 
                  detection.expressions[a] > detection.expressions[b] ? a : b
                );

                // Set color based on expression
                let boxColor;
                switch (highestExpression) {
                  case 'happy':
                    boxColor = 'green';
                    break;
                  case 'sad':
                    boxColor = 'red';
                    break;
                  default:
                    boxColor = 'blue'; // For neutral and other expressions
                }

                // Draw the bounding box
                ctx.strokeStyle = boxColor;  // Set the box color
                ctx.lineWidth = 2;            // Set line width
                ctx.strokeRect(x, y, width, height); // Draw the rectangle

                // Draw text for detected expression
                ctx.font = '18px Arial';
                ctx.fillStyle = boxColor;     // Set text color same as box
                ctx.fillText(highestExpression, x, y - 10); // Draw the expression text
              });
            }
          }
        }
      }, 100);

      return () => clearInterval(detect);
    };

    loadAllModels();
  }, []);

  return (
    <div style={{ position: 'relative', width: '50vw', margin: '0 auto' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user' }}
        style={{ width: '100%' }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default WebcamFeed;
