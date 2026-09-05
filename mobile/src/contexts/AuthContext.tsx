import { onAuthStateChanged, User } from 'firebase/auth';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { auth } from '../services/firebase';
import { api } from '../services/api';
import { registerForPushNotifications } from '../services/notifications';

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  profileComplete: boolean;
  refreshProfile: () => Promise<void>;
}>({
  user: null,
  loading: true,
  profileComplete: false,
  refreshProfile: async () => {},
});

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] =
    useState(false);

    const refreshProfile = async () => {
      if (!auth.currentUser) {
        setProfileComplete(false);
        return;
      }
    
      try {
        const profile = await api<{
          profileComplete?: boolean;
        }>('/api/users/me');
    
        const isProfileComplete =
  profile.profileComplete === true;

setProfileComplete(isProfileComplete);

if (isProfileComplete) {
  console.log('Profile complete — registering for notifications');

  const pushToken =
    await registerForPushNotifications();

  console.log('Push registration result:', pushToken);

  if (pushToken) {
    console.log(
      'Registered push token:',
      pushToken
    );
  }
}
      } catch (e) {
        console.warn(
          'Could not refresh profile:',
          e instanceof Error ? e.message : e
        );
    
        setProfileComplete(false);
      }
    };

    useEffect(() => {
      return onAuthStateChanged(auth, async (next) => {
        setLoading(true);
        setUser(next);
    
        if (!next) {
          setProfileComplete(false);
          setLoading(false);
          return;
        }
    
        try {
          const profile = await api<{
            profileComplete?: boolean;
          }>('/api/users/me');
          
          const isProfileComplete =
            profile.profileComplete === true;
          
          console.log(
            'Loaded profile. Complete:',
            isProfileComplete
          );
          
          setProfileComplete(isProfileComplete);
          
          if (isProfileComplete) {
            console.log(
              'Profile complete — registering for notifications'
            );
          
            const pushToken =
              await registerForPushNotifications();
          
            console.log(
              'Push registration result:',
              pushToken
            );
          }
        } catch (e) {
          console.warn(
            'Could not load profile:',
            e instanceof Error ? e.message : e
          );
    
          setProfileComplete(false);
        } finally {
          setLoading(false);
        }
      });
    }, []);

  return (
    <AuthContext.Provider
    value={{
      user,
      loading,
      profileComplete,
      refreshProfile,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);