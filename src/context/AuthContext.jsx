import { useState, createContext, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";
import { setActiveResumeUser, clearLocalResumeDataForUser } from "../utils/resumeStorage";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(true)

  const signupNewUser = async (username, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options:{
          data: {
            username,
          }
        }
      });

      if (error) {
        console.error("There was a problem signing up:", error);
        return {
          success: false,
          error: "Could not create the account. Please check your details and try again.",
        };
      }

      if (import.meta.env.DEV) console.debug("Signup success");

      return {
        success: true,
        data,
        requiresEmailConfirmation: !data?.session,
      };
    } catch (error) {
      console.error("Signup error:", error);

      return {
        success: false,
        error: error.message,
      };
    }
  };

  const signInUser = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Signin error occurred:", error);

        return {
          success: false,
          error: "Incorrect email or password.",
        };
      }

      if (import.meta.env.DEV) console.debug("Sign-in success");

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("An error occurred:", error);

      return {
        success: false,
        error: "Incorrect email or password.",
      };
    }
  };

  const deleteAccount = async () => {
    const { data: { session } = {} } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Your session has expired. Please sign in again.");
    const response = await fetch("/api/account", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    let payload = null;
    try { payload = await response.json(); } catch (error) { console.warn("Unable to read account deletion response.", error); }
    if (!response.ok) throw new Error(payload?.error || "Unable to delete your account.");
    const userId = session.user.id;
    clearLocalResumeDataForUser(userId);
    await supabase.auth.signOut();
    return { success: true };
  };

  useEffect(() => {
  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    setSession(session)
    setActiveResumeUser(session?.user?.id || null)
    setLoading(false)
  }

  getSession()

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
    setActiveResumeUser(session?.user?.id || null)
  })

  return () => {
    subscription.unsubscribe()
  }
  }, [])

  const Signout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("There was an error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signupNewUser,
        signInUser,
        Signout,
        deleteAccount,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

