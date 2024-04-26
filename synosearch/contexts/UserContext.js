import { createContext } from 'react';

const UserContext = createContext({
  user: null,
  setUser: () => {},
  supabase: null,
  subscriptionLevel: null, // Add this line
  setSubscriptionLevel: () => {}, // Add this line
});

export default UserContext;