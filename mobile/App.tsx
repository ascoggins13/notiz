import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/contexts/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import {
    setNotificationNavigationPending,
    clearNotificationNavigationPending,
  } from './src/services/notificationNavigation';

export default function App() {
  const navigationRef = useRef<any>(null);
  const pendingNotificationRef = useRef<{
    type?: unknown;
    matchId?: unknown;
    checkinId?: unknown;
    venueId?: unknown;
    venueName?: unknown;
    venueType?: unknown;
  } | null>(null);
  const handleNotificationNavigation = (
    data: Record<string, unknown>
  ) => {
    console.log(
      'HANDLE NOTIFICATION NAVIGATION:',
      data
    );
    const type = data?.type;
    const matchId = data?.matchId;
    const checkinId = data?.checkinId;
    const venueId = data?.venueId;
    const venueName = data?.venueName;
    const venueType = data?.venueType;
  
    if (type === 'candidate_notice') {
        if (
          typeof checkinId !== 'string' ||
          typeof venueId !== 'string' ||
          typeof venueName !== 'string' ||
          (venueType !== 'gym' && venueType !== 'bar')
        ) {
          return;
        }
      
        setNotificationNavigationPending();
      
        if (!navigationRef.current?.isReady()) {
          pendingNotificationRef.current = data;
          return;
        }
      
        pendingNotificationRef.current = null;
      
        navigationRef.current.navigate('Notice', {
          checkinId,
          venueId,
          venueName,
          venueType,
        });
      
        setTimeout(() => {
          clearNotificationNavigationPending();
        }, 1000);
      
        return;
      }
      
      if (typeof matchId !== 'string') {
        return;
      }
      
      const targetRoute =
        type === 'mutual_match'
          ? 'MatchDetail'
          : type === 'chat_message'
            ? 'Chat'
            : null;
  
    if (!targetRoute) {
      return;
    }
    console.log(
        'NOTIFICATION TARGET:',
        targetRoute,
        'MATCH:',
        matchId
      );
    setNotificationNavigationPending();
  
    if (!navigationRef.current?.isReady()) {
      pendingNotificationRef.current = data;
      return;
    }
  
    const rootState =
      navigationRef.current.getRootState();
  
    const routeExists =
      rootState?.routeNames?.includes(targetRoute);
  
    if (!routeExists) {
      console.log(
        'Notification route not ready yet:',
        targetRoute
      );
  
      pendingNotificationRef.current = data;
      return;
    }
  
    pendingNotificationRef.current = null;
  
    navigationRef.current.navigate(
        targetRoute,
        { matchId }
      );
      
      setTimeout(() => {
        clearNotificationNavigationPending();
      }, 1000);
    };

    useEffect(() => {
        Notifications.getLastNotificationResponseAsync()
          .then((response) => {
            console.log(
              'LAST NOTIFICATION RESPONSE:',
              JSON.stringify(response, null, 2)
            );
      
            if (!response) {
              return;
            }
      
            const data =
              response.notification.request.content.data;
      
            console.log(
              'LAST NOTIFICATION DATA:',
              data
            );
      
            handleNotificationNavigation(data);
          });
      
        const subscription =
          Notifications.addNotificationResponseReceivedListener(
            (response) => {
              console.log(
                'NOTIFICATION TAP RESPONSE:',
                JSON.stringify(response, null, 2)
              );
      
              const data =
                response.notification.request.content.data;
      
              console.log(
                'NOTIFICATION TAP DATA:',
                data
              );
      
              handleNotificationNavigation(data);
            }
          );
      
        return () => {
          subscription.remove();
        };
      }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
      <NavigationContainer
  ref={navigationRef}
  onReady={() => {
    const pending =
      pendingNotificationRef.current;

    if (pending) {
      handleNotificationNavigation(pending);
    }
  }}
  onStateChange={() => {
    const pending =
      pendingNotificationRef.current;

    if (pending) {
      console.log(
        'Navigation changed — retrying notification'
      );

      handleNotificationNavigation(pending);
    }
  }}
>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
