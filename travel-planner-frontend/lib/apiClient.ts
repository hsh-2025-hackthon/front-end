import { msalInstance } from "../services/msal";
import { SilentRequest } from "@azure/msal-browser";

const getAccessToken = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    const request: SilentRequest = {
      scopes: [process.env.NEXT_PUBLIC_API_SCOPE || "api://YOUR_API/access_as_user"],
      account: accounts[0],
    };
    try {
      const response = await msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      return msalInstance.acquireTokenPopup(request).then(res => res.accessToken);
    }
  }
  return null;
};

const apiClient = async (url: string, method: string, body?: any) => {
  const token = await getAccessToken();
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`/api/v1${url}`, options);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

export default apiClient;
