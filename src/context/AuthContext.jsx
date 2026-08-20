import { useState, createContext, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

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
          error: error.message,
        };
      }

      console.log("Signup success:", data);

      return {
        success: true,
        data,
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
          error: error.message,
        };
      }

      console.log("Sign-in success:", data);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("An error occurred:", error);

      return {
        success: false,
        error: error.message,
      };
    }
  };

  useEffect(() => {
  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    setSession(session)
    setLoading(false)
  }

  getSession()

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
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

