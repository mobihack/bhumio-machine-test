import { useState, useEffect } from "react";

import {
  G_CLIENT_ID,
  G_DISCOVERY_DOCS,
  G_SCOPES,
} from "config/gdrive";

interface UseGoogleLoginType {
  user: {
    cu: string;
    hK: string;
    Ad: string;
  } | null;
  isLoggedIn: boolean;
  signIn: () => Promise<{ access_token: string; id_token: string }>;
  signOut: () => Promise<void>;
}
export const useGoogleLogin = (): UseGoogleLoginType => {
  var gapi: any;
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateSigninStatus = (isSignedIn: boolean) => {
    if (isSignedIn) {
      // Set the signed in user
      const auth = gapi.auth2.getAuthInstance();
      setUser(auth.currentUser.get().getBasicProfile());
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      // prompt user to sign in?
    }
  };

  const loadGapi = async () => {
    gapi = await (await import("gapi-script")).gapi;
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          //apiKey: G_CLIENT_KEY,
          clientId: G_CLIENT_ID,
          discoveryDocs: G_DISCOVERY_DOCS,
          scope: G_SCOPES,
        })
        .then(() => {

          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    });
  };

  useEffect(() => {
    loadGapi();
  }, []);

  const signIn = async () => {
    //var gapi = await (await import("gapi-script")).gapi;
    const auth = await gapi.auth2.getAuthInstance();
    await auth.signIn();
    const { access_token, id_token } = await auth.currentUser
      .get()
      .getAuthResponse();

    return { access_token, id_token };
  };

  const signOut = async () => {
    gapi = await (await import("gapi-script")).gapi;
    const auth = await gapi.auth2.getAuthInstance();
    await auth.signOut();
  };

  return { user, isLoggedIn, signIn, signOut };
};
