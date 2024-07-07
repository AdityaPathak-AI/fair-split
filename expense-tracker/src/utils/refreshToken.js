import axios from 'axios';


const getToken = async () => {
    let refreshToken = getCookie('refreshToken');
    
    if (refreshToken) {
      try {
        const response = await axios.post(
          'http://localhost:3030/api/v1/users/getAccessToken',
          { refreshToken } 
        );
        return response?.data?.accessToken
      } catch (error) {
        console.error("Error getting access token:", error);
        return null;
      }
    }
  };


  const getCookie = (name) => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  };

  export {getToken,getCookie}