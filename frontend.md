# Frontend Implementation Guide

This guide provides a comprehensive plan for building the frontend of the Collaborative Travel Planning AI System. It is intended to be used by an AI agent for implementation.

## 1. Core Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) with React.
- **State Management:** [Jotai](https://jotai.org/) for atomic and performant state management suitable for collaboration.
- **Real-time Collaboration:** [Y.js](https://yjs.dev/) (a CRDT implementation) integrated with [Azure Web PubSub](https://azure.microsoft.com/en-us/services/web-pubsub/) for real-time data synchronization.
- **Authentication:** [Microsoft Authentication Library (MSAL) for JS](https://github.com/AzureAD/microsoft-authentication-library-for-js) to integrate with Azure AD B2C.
- **UI Components:** Use a modern component library like [Material-UI (MUI)](https://mui.com/) or [Chakra UI](https://chakra-ui.com/) for a consistent and accessible design system.
- **Progressive Web App (PWA):** [Workbox](https://developer.chrome.com/docs/workbox/) for implementing service workers for offline capabilities.

## 2. Project Setup

1.  **Initialize Next.js Project:**
    ```bash
    npx create-next-app@latest travel-planner-frontend --typescript
    ```
2.  **Install Dependencies:**
    ```bash
    npm install jotai yjs @azure/web-pubsub-client @azure/msal-browser @azure/msal-react @mui/material @emotion/react @emotion/styled workbox-webpack-plugin
    ```

## 3. Architecture

The frontend will follow a micro-frontend-ready architecture using **Module Federation** if the application grows in complexity. For the initial build, a component-based architecture will suffice.

### Directory Structure

```
/
├── components/         # Shared UI components (e.g., Buttons, Cards, Modals)
├── features/           # Feature-based modules (e.g., Itinerary, Booking, Maps)
│   ├── itinerary/
│   │   ├── components/ # Components specific to the itinerary feature
│   │   ├── hooks/      # React hooks for itinerary logic
│   │   └── state.ts    # Jotai atoms for itinerary state
├── lib/                # Helper functions, utilities, API clients
├── pages/              # Next.js pages and API routes
│   └── api/
├── public/             # Static assets
├── services/           # Services for external integrations (e.g., Azure, Google Maps)
├── store/              # Global Jotai atoms and state management logic
└── styles/             # Global styles
```

## 4. Implementation Steps

### Step 1: Authentication with Azure AD B2C

Implement user authentication using MSAL and Azure AD B2C.

-   **Configure MSAL:** Create a `services/msal.ts` file to configure the `PublicClientApplication`. Use environment variables for sensitive configuration.
-   **Create AuthProvider:** Wrap the application in an `MsalProvider` in `_app.tsx`.
-   **Implement Login/Logout:** Create UI components for login and logout buttons, and a hook `useAuth()` to access authentication status and user information.
-   **Protected Routes:** Implement logic to redirect unauthenticated users from protected pages.

**Reference Code (`PLAN.md`):**
```javascript
// services/msal.ts
import { PublicClientApplication, EventType } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    authority: `https://${process.env.NEXT_PUBLIC_B2C_TENANT_NAME}.b2clogin.com/${process.env.NEXT_PUBLIC_B2C_TENANT_NAME}.onmicrosoft.com/${process.env.NEXT_PUBLIC_B2C_POLICY}`,
    knownAuthorities: [`${process.env.NEXT_PUBLIC_B2C_TENANT_NAME}.b2clogin.com`],
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Handle login events for logging or other actions
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});
```

### Step 2: State Management with Jotai

Define Jotai atoms for managing global and feature-specific state.

-   **Global State:** Create atoms for user profile, authentication status, etc., in `store/atoms.ts`.
-   **Feature State:** For a feature like the itinerary, define atoms in `features/itinerary/state.ts`. This keeps state management co-located with the feature.

**Reference Code (`PLAN.md`):**
```javascript
// features/itinerary/state.ts
import { atom } from 'jotai';

export const itineraryAtom = atom([]); // Holds the list of destinations and activities
export const collaboratorsAtom = atom([]); // Holds the list of active collaborators

// Example of a derived atom to add a destination
export const addDestinationAtom = atom(
  null,
  (get, set, destination) => {
    const currentItinerary = get(itineraryAtom);
    const newItinerary = [...currentItinerary, { ...destination, id: Date.now() }];
    set(itineraryAtom, newItinerary);
    // This is where you would also sync the change with Y.js
  }
);
```

### Step 3: Real-time Collaboration with Y.js and Azure Web PubSub

This is a critical feature. The goal is to have shared state that syncs automatically between all collaborators on a trip.

1.  **Setup Y.js Document:** Create a shared Y.js document (`Y.Doc`). The itinerary data will be stored in this document as a `Y.Array` or `Y.Map`.
2.  **Create a Web PubSub Provider:** Implement a provider that connects Y.js to Azure Web PubSub. This provider will listen for local Y.js changes and broadcast them, and listen for remote messages from Web PubSub to apply to the local Y.js document.
3.  **Integrate with React:** Create a hook `useSharedItinerary(tripId)` that:
    -   Initializes the Y.js document and the Web PubSub provider for a given `tripId`.
    -   Subscribes to changes in the Y.js document and updates the React state (managed by Jotai) accordingly.
    -   Provides functions to modify the Y.js document, which will trigger synchronization.

**Reference Code (`PLAN.md`):**
```javascript
// services/WebPubSubProvider.ts
import { WebPubSubClient } from "@azure/web-pubsub-client";
import * as Y from "yjs";
// ... (Implementation of a custom provider to sync Y.js updates over Web PubSub)

// features/itinerary/hooks/useSharedItinerary.ts
import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebPubSubProvider } from '../../../services/WebPubSubProvider'; // Your custom provider

export function useSharedItinerary(tripId) {
  const [itinerary, setItinerary] = useState([]);
  const ydoc = new Y.Doc();

  useEffect(() => {
    const provider = new WebPubSubProvider(
      'YOUR_WEBPUBSUB_CONNECTION_STRING', // Should be fetched securely
      tripId,
      ydoc
    );

    const yItinerary = ydoc.getArray('itinerary');

    const updateItinerary = () => {
      setItinerary(yItinerary.toJSON());
    };

    yItinerary.observe(updateItinerary);

    // Connect to the provider
    provider.connect();

    return () => {
      provider.disconnect();
      yItinerary.unobserve(updateItinerary);
    };
  }, [tripId]);

  const addDestination = (destination) => {
    const yItinerary = ydoc.getArray('itinerary');
    yItinerary.push([destination]);
  };

  return { itinerary, addDestination };
}
```

### Step 4: Progressive Web App (PWA) for Offline Support

Enable offline access to itineraries and other essential data.

-   **Configure Workbox:** Use `workbox-webpack-plugin` in `next.config.js` to generate a service worker.
-   **Caching Strategies:**
    -   **Cache First:** For static assets (CSS, JS, images).
    -   **Network First:** For API data like trip itineraries, so the user sees the latest version when online but has a fallback when offline.
    -   **Stale While Revalidate:** For non-critical data that can be updated in the background.

**Reference Code (`PLAN.md`):**
```javascript
// next.config.js with workbox
const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development', // Disable PWA in dev
});

module.exports = withPWA({
  // next.js config
});

// In your service worker file (e.g., worker/index.ts compiled by workbox)
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// Cache images from Azure CDN
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({ cacheName: 'images' })
);

// Cache API responses for itineraries
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/trips'),
  new NetworkFirst({ cacheName: 'api-cache' })
);
```

## 5. Deployment

Deploy the frontend to **Azure Static Web Apps**.

-   **Create Azure Static Web App:** Provision a new Static Web App resource in the Azure portal.
-   **Configure CI/CD:** Link your repository (e.g., GitHub). Azure DevOps or GitHub Actions will be configured automatically to build and deploy the Next.js application on every push to the main branch.
-   **Environment Variables:** Configure the necessary environment variables (e.g., `NEXT_PUBLIC_AZURE_CLIENT_ID`, API endpoint) in the Azure Static Web Apps configuration section.
-   **API Integration:** If using Next.js API routes, they will be deployed as Azure Functions automatically. For a separate backend, configure the API location in the Static Web Apps settings to handle proxying requests.
