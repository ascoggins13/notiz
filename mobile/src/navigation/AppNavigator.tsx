import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ConnectionReadyScreen } from '../screens/ConnectionReadyScreen';
import { useAuth } from '../contexts/AuthContext';
import { GuestHomeScreen } from '../screens/GuestHomeScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MatchDetailScreen } from '../screens/MatchDetailScreen';
import { MatchesScreen } from '../screens/MatchesScreen';
import { NoticeScreen } from '../screens/NoticeScreen';
import { SelfDescriptionScreen } from '../screens/SelfDescriptionScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { WaitingScreen } from '../screens/WaitingScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { RootStackParamList } from '../types';
import { LocationSelectScreen } from '../screens/LocationSelectScreen';
import { ActiveVenueScreen } from '../screens/ActiveVenueScreen';
import { NotizSentScreen } from '../screens/NotizSentScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PrivacySafetyScreen } from '../screens/PrivacySafetyScreen';
import { BlockedUsersScreen } from '../screens/BlockedUsersScreen';
import { ReportUserScreen } from '../screens/ReportUserScreen';
import { LegalScreen } from '../screens/LegalScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from '../screens/TermsOfServiceScreen';
import { CommunityGuidelinesScreen } from '../screens/CommunityGuidelinesScreen';



const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {
    user,
    loading,
    profileComplete,
  } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FAFAFC',
        }}
      >
        <ActivityIndicator color="#5427A5" />
      </View>
    );
  }

  if (user && !profileComplete) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetupScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

 
  
  if (user && profileComplete) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={{ headerShown: false }}
/>

<Stack.Screen
  name="EditProfile"
  component={EditProfileScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
    headerTintColor: '#5427A5',
  }}
/>

<Stack.Screen
  name="Settings"
  component={SettingsScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
    headerTintColor: '#5427A5',
  }}
/>
<Stack.Screen
  name="Legal"
  component={LegalScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerTintColor: '#5427A5',
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
  }}
/>
<Stack.Screen
  name="PrivacyPolicy"
  component={PrivacyPolicyScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerTintColor: '#5427A5',
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
  }}
/>

<Stack.Screen
  name="TermsOfService"
  component={TermsOfServiceScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerTintColor: '#5427A5',
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
  }}
/>
<Stack.Screen
  name="CommunityGuidelines"
  component={CommunityGuidelinesScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerTintColor: '#5427A5',
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
  }}
/>

<Stack.Screen
  name="BlockedUsers"
  component={BlockedUsersScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
    headerTintColor: '#5427A5',
  }}
/>

<Stack.Screen
  name="ReportUser"
  component={ReportUserScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerTintColor: '#5427A5',
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
  }}
/>

<Stack.Screen
  name="PrivacySafety"
  component={PrivacySafetyScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
    headerTintColor: '#5427A5',
  }}
/>
	<Stack.Screen
  name="LocationSelect"
  component={LocationSelectScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
  }}
/>

        <Stack.Screen
          name="SelfDescription"
          component={SelfDescriptionScreen}
          options={{ title: 'Your description' }}
        />
	<Stack.Screen
  name="ActiveVenue"
  component={ActiveVenueScreen}
  options={{
    headerShown: false,
  }}
/>

        <Stack.Screen
          name="Notice"
          component={NoticeScreen}
        />
	
	<Stack.Screen
 	 name="NotizSent"
 	 component={NotizSentScreen}
 	 options={{ headerShown: false }}
	/>

        <Stack.Screen
          name="Waiting"
          component={WaitingScreen}
        />

        <Stack.Screen
          name="Matches"
          component={MatchesScreen}
        />

        <Stack.Screen
          name="MatchDetail"
          component={MatchDetailScreen}
          options={{ title: 'Mutual notice' }}
        />
	<Stack.Screen
  name="ConnectionReady"
  component={ConnectionReadyScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen
  name="Chat"
  component={ChatScreen}
  options={{
    title: '',
    headerShown: true,
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
    headerTintColor: '#5427A5',
  }}
/>
	
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="GuestHome"
        component={GuestHomeScreen}
        options={{ headerShown: false }}
      />

<Stack.Screen
  name="PrivacyPolicy"
  component={PrivacyPolicyScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerTintColor: '#5427A5',
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
  }}
/>

<Stack.Screen
  name="TermsOfService"
  component={TermsOfServiceScreen}
  options={{
    title: '',
    headerShadowVisible: false,
    headerTintColor: '#5427A5',
    headerStyle: {
      backgroundColor: '#FAFAFC',
    },
  }}
/>

<Stack.Screen
  name="Register"
  component={RegisterScreen}
  options={{
    title: '',
    headerShadowVisible: false,
  }}
/>

<Stack.Screen
  name="ProfileSetup"
  component={ProfileSetupScreen}
  options={{ headerShown: false }}
/>

      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: '',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
