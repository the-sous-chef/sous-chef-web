export const config = {
    deployment: process.env.DEPLOYMENT,
    environment: process.env.ENVIRONMENT,
    auth0: {
        clientId: process.env.AUTH0_CLIENT_ID,
        domain: process.env.AUTH0_DOMAIN,
    },
    firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
} as App.Config;
