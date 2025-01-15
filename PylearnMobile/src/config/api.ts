export const config = {
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://13.229.113.45',
    endpoints: {
      login: '/login',
      register: '/register'
    }
  };