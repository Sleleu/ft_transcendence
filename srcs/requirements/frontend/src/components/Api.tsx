const baseRequest = async (url : string, method : string) => {
  const response = await fetch(url, {
    method: method,
    credentials: 'include'
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`Failed to perform request: ${response.statusText}`);
  }
};

export const getUserProfile = () => baseRequest("http://localhost:5000/users/profile", "GET");

export const logout = () => baseRequest("http://localhost:5000/users/logout", "GET");

export const enableTwoFA = () => baseRequest("http://localhost:5000/twofa/enable-2fa", "POST");

export const disableTwoFA = () => baseRequest("http://localhost:5000/twofa/disable-2fa", "POST");

export const disableTwoFAVerified = () => baseRequest("http://localhost:5000/twofa/disable-2fa-verified", "POST");

export const check2FA = () => baseRequest("http://localhost:5000/twofa/check-2fa", "GET");

export const check2FAVerified = () => baseRequest("http://localhost:5000/twofa/check-2fa-verified", "GET");