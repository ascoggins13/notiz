export type VenueType = 'gym' | 'bar';

export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Register: undefined;
  ProfileSetup: undefined;
  EditProfile: undefined;
  Settings: undefined;
  PrivacySafety: undefined;
  GuestHome: undefined;
  Home: {
    handledMatchId?: string;
  } | undefined;
  Profile: undefined;
  LocationSelect: undefined;
  BlockedUsers: undefined;
  Legal: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  CommunityGuidelines: undefined;
  

  SelfDescription: {
    venueId: string;
    venueName: string;
    venueType: VenueType;
  };

  ActiveVenue: {
    checkinId: string;
    venueId: string;
    venueName: string;
    venueType: VenueType;
    handledMatchId?: string;
  };

Notice: {
  checkinId: string;
  venueId: string;
  venueName: string;
  venueType: VenueType;
};

  NotizSent: {
    checkinId: string;
    venueId: string;
    venueName: string;
    venueType: VenueType;
  };

  Waiting: undefined;
  Matches: undefined;

  MatchDetail: {
    matchId: string;
  };

  ConnectionReady: {
    matchId: string;
  };
Chat: {
  matchId: string;
};
ReportUser: {
  userId: string;
  displayName: string;
  matchId: string;
};
};


export interface AppearanceDescription {
  gender?: string;

  topType?: string;
  shirtColor?: string;

  bottomType?: string;
  pantsColor?: string;

  shoeColor?: string;

  jewelry?: string[];

  identifiers: string[];

  venueArea?: string;
  activity?: string;
}
