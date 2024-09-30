import * as faceapi from 'face-api.js';

export const loadModels = async () => {
  const MODEL_URL = process.env.PUBLIC_URL + '/models';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
};
