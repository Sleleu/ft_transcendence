
export const getUserProfile = async () => {
    const response = await fetch("http://localhost:5000/users/profile", {
      method: "GET",
      credentials: 'include'
    });
  
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch user profile');
    }
  };

export async function logout() {
    const response = await fetch('http://localhost:5000/users/logout', {
      method: 'POST',
      credentials: 'include',
    });
  
    if (!response.ok) {
      throw new Error(`Failed to log out: ${response.statusText}`);
    }
  }

  export const enableTwoFA = async () => {
    const response = await fetch("http://localhost:5000/twofa/enable-2fa", {
      method: "POST",
      credentials: 'include'
    });
  
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to enable two-factor authentication');
    }
  };

  export const disableTwoFA = async () => {
    const response = await fetch("http://localhost:5000/twofa/disable-2fa", {
      method: "POST",
      credentials: 'include'
    });
  
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to disable two-factor authentication');
    }
  };
  