import { ReactNode, createContext, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";
import Router from "next/router";

interface AuthData {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signUp: (credentials: SignUpProps) => Promise<void>;
  signOut: () => Promise<void>;
}

interface UserProps {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
}

interface SignInProps {
  email: string;
  password: string;
}

interface SignUpProps {
  name: string;
  email: string;
  avatar: string;
  password: string;
}

type AuthProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthData);

export function logOut() {
  try {
    destroyCookie(null, "@estoque.token", { path: "/" });
    Router.push("/");
  } catch (error) {
    console.log(error);
  }
}

export function AuthProvider({ children }: AuthProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "@estoque.token": token } = parseCookies();

    if (token) {
      api
        .get("/user/detail")
        .then((response) => {
          const { id, name, email, avatar, balance } = response.data;
          setUser({ id, name, email, avatar, balance });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/user/auth", {
        email,
        password,
      });

      const { id, name, avatar, balance, token } = response.data;

      setCookie(undefined, "@estoque.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({ id, name, email, avatar, balance });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      toast.success("Bem vindo(a) ao Dashboard!");
      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  async function signUp({ name, email, avatar, password }: SignUpProps) {
    try {
      await api.post("/user", {
        name,
        email,
        avatar,
        password,
      });

      Router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  async function signOut() {
    try {
      destroyCookie(null, "@estoque.token", { path: "/" });
      setUser(null);
      Router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
