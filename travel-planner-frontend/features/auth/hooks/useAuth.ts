import { useMsal } from "@azure/msal-react";
import { SilentRequest } from "@azure/msal-browser";

export function useAuth() {
  const { instance, accounts } = useMsal();

  const login = () => {
    instance.loginPopup();
  };

  const logout = () => {
    instance.logoutPopup();
  };

  const getAccessToken = async () => {
    if (accounts.length > 0) {
      const request: SilentRequest = {
        scopes: [process.env.NEXT_PUBLIC_API_SCOPE || "api://YOUR_API/access_as_user"],
        account: accounts[0],
      };
      try {
        const response = await instance.acquireTokenSilent(request);
        return response.accessToken;
      } catch (error) {
        return instance.acquireTokenPopup(request).then(res => res.accessToken);
      }
    }
    return null;
  };

  return {
    isAuthenticated: accounts.length > 0,
    user: accounts.length > 0 ? accounts[0] : null,
    login,
    logout,
    getAccessToken,
  };
}
