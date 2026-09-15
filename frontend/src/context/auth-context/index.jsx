import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function handleRegisterUser(event) {
    event.preventDefault();

    try {
      const data = await registerService(signUpFormData);

      if (data.success) {
        toast({
          variant: "success",
          title: "Account created",
          description: "You can now sign in with your new account.",
        });
        setSignUpFormData(initialSignUpFormData);
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: data.message || "Please try again.",
        });
      }

      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description:
          error?.response?.data?.message || "Something went wrong.",
      });

      return { success: false };
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();

    try {
      const data = await loginService(signInFormData);

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        toast({
          variant: "success",
          title: "Welcome back",
          description: `Signed in as ${data.data.user.userName}`,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: data.message || "Invalid credentials.",
        });
      }

      return data;
    } catch (error) {
      setAuth({
        authenticate: false,
        user: null,
      });
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description:
          error?.response?.data?.message || "Something went wrong.",
      });

      return { success: false };
    }
  }

  //check auth user

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  function resetCredentials() {
    sessionStorage.removeItem("accessToken");
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
