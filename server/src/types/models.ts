export type ColorName =
  | 'black' | 'white' | 'gray' | 'red' | 'blue' | 'green'
  | 'yellow' | 'orange' | 'purple' | 'pink' | 'brown' | 'other';

export interface AppearanceDescription {
  gender?: string;

  topType?: string;
  shirtColor?: ColorName;

  bottomType?: string;
  pantsColor?: ColorName;

  shoeColor?: ColorName;

  jewelry?: string[];

  identifiers?: string[];

  venueArea?: string;
  activity?: string;
}

export interface Checkin {
  id?: string;
  userId: string;
  venueId: string;
  venueName: string;
  status: 'active' | 'expired' | 'ended';
  checkedInAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp;
}

export interface Notice {
  id?: string;
  senderId: string;
  senderCheckinId: string;
  venueId: string;
  targetDescription: AppearanceDescription;
  candidateUserId?: string;
  confidenceScore?: number;
status:
  | 'searching'
  | 'needs_clarification'
  | 'candidate_found'
  | 'mutual'
  | 'expired'
  | 'cancelled';
  createdAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp;
}
