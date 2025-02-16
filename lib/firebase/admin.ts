import admin from 'firebase-admin';
import serviceAccount from './black-scholes-app-firebase-adminsdk-fbsvc-f03c9d14e5.json';

// If you're using TypeScript, make sure "resolveJsonModule": true is set in tsconfig.json
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

export { admin };