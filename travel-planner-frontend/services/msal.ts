import { PublicClientApplication, EventType } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || 'YOUR_CLIENT_ID',
    authority: `https://${process.env.NEXT_PUBLIC_B2C_TENANT_NAME || 'YOUR_TENANT_NAME'}.b2clogin.com/${process.env.NEXT_PUBLIC_B2C_TENANT_NAME || 'YOUR_TENANT_NAME'}.onmicrosoft.com/${process.env.NEXT_PUBLIC_B2C_POLICY || 'YOUR_POLICY'}`,
    knownAuthorities: [`${process.env.NEXT_PUBLIC_B2C_TENANT_NAME || 'YOUR_TENANT_NAME'}.b2clogin.com`],
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Handle login events for logging or other actions
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as any;
    if (payload.account) {
      msalInstance.setActiveAccount(payload.account);
    }
  }
});
