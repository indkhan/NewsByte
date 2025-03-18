import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// News category types
export type NewsCategory = 'general' | 'entertainment' | 'sports' | 'politics' | 'science' | 'technology';
export type Language = 'en' | 'de';

// User type definition
export interface User {
  email: string;
  name: string;
  preferences: {
    language: Language;
    categories: NewsCategory[];
  };
}

// Auth state interface
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

// Auth context type
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, language: Language, categories: NewsCategory[]) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (language: Language, categories: NewsCategory[]) => Promise<boolean>;
}

// Sample users for development
const SAMPLE_USERS = [
  {
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User',
    preferences: {
      language: 'en' as Language,
      categories: ['general', 'technology'] as NewsCategory[]
    }
  }
];

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  updatePreferences: async () => false
});

// Storage keys
const AUTH_STORAGE_KEY = 'newsbyte_auth';
const USERS_STORAGE_KEY = 'newsbyte_users';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false
  });

  // Initialize users if none exist
  const initUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) {
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SAMPLE_USERS));
      }
    } catch (error) {
      console.error('Error initializing users:', error);
    }
  };

  // Load auth state on startup
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          setAuthState({
            user: parsedAuth.user,
            isLoggedIn: true
          });
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      }
    };

    initUsers();
    loadAuthState();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const user = users.find((u: any) => 
          u.email === email && u.password === password
        );

        if (user) {
          const userData = {
            email: user.email,
            name: user.name,
            preferences: user.preferences
          };
          
          setAuthState({
            user: userData,
            isLoggedIn: true
          });

          // Save auth state to storage
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            user: userData
          }));
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Signup function
  const signup = async (
    name: string, 
    email: string, 
    password: string,
    language: Language,
    categories: NewsCategory[]
  ): Promise<boolean> => {
    try {
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        
        // Check if user already exists
        if (users.some((u: any) => u.email === email)) {
          return false;
        }
        
        // Add new user with preferences
        const newUser = { 
          email, 
          password, 
          name,
          preferences: {
            language,
            categories
          }
        };
        
        users.push(newUser);
        
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        
        // Auto login after signup
        const userData = {
          email: newUser.email,
          name: newUser.name,
          preferences: newUser.preferences
        };
        
        setAuthState({
          user: userData,
          isLoggedIn: true
        });
        
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          user: userData
        }));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  // Update user preferences
  const updatePreferences = async (language: Language, categories: NewsCategory[]): Promise<boolean> => {
    try {
      if (!authState.user) return false;

      // Update current user's preferences
      const updatedUser = {
        ...authState.user,
        preferences: {
          language,
          categories
        }
      };

      // Update auth state
      setAuthState({
        user: updatedUser,
        isLoggedIn: true
      });

      // Update stored auth
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user: updatedUser
      }));

      // Update user in users storage
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: any) => {
          if (u.email === authState.user!.email) {
            return {
              ...u,
              preferences: {
                language,
                categories
              }
            };
          }
          return u;
        });
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      }

      return true;
    } catch (error) {
      console.error('Update preferences error:', error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthState({
        user: null,
        isLoggedIn: false
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updatePreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => useContext(AuthContext); 