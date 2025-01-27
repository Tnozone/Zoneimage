//check if logged in session is expired
export const checkTokenExpiry = () => {
    const token = localStorage.getItem('token');
  
    if (!token) return false; // No token, assume not logged in.
  
    try {
      // Decode the token manually (JWT tokens are base64 encoded)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = JSON.parse(atob(base64));
  
      // Get current time (in seconds)
      const currentTime = Math.floor(Date.now() / 1000);
  
      // Compare expiration time (in seconds) with current time
      if (jsonPayload.exp < currentTime) {
        return false; // Token has expired
      }
      return true; // Token is still valid
    } catch (error) {
      console.error('Error decoding the token:', error);
      return false; // In case of error, assume token is invalid
    }
  };
  
  //check if user is logged in
  export const checkLoginState = () => {
    const isValidToken = checkTokenExpiry();
    if (!isValidToken) {
      // Token has expired, return false
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return false;
    }
  
    // Token is still valid, return true
    const username = localStorage.getItem('username');
    return { isLoggedIn: true, username };
  };