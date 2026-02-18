"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

interface AuthContextType {
  user:     User | null;
  loading:  boolean;
  error:    string | null;
  login:    (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout:   () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found':          'Usuario no encontrado',
  'auth/wrong-password':          'Contraseña incorrecta',
  'auth/invalid-email':           'El email no es válido',
  'auth/user-disabled':           'Esta cuenta ha sido deshabilitada',
  'auth/too-many-requests':       'Demasiados intentos. Espera unos minutos',
  'auth/invalid-credential':      'Email o contraseña incorrectos',
  'auth/network-request-failed':  'Error de red. Comprueba tu conexión',
  'auth/email-already-in-use':    'Este email ya está registrado',
  'auth/weak-password':           'La contraseña debe tener al menos 6 caracteres',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const code    = (err as AuthError).code;
      const message = AUTH_ERROR_MESSAGES[code] ?? 'Error al iniciar sesión';
      setError(message);
      throw err;
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const code    = (err as AuthError).code;
      const message = AUTH_ERROR_MESSAGES[code] ?? 'Error al crear la cuenta';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
