const baseRequest = async (url : string, method : string) => {
  const response = await fetch('http://localhost:5000' + url, {
    method: method,
    credentials: 'include'
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`Failed to perform request: ${response.statusText}`);
  }
};

export const verifyTwoFACode = async (code : string) => {
  const response = await fetch(
    `http://localhost:5000/twofa/verify-2fa-code`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ code })
    });
  
  if (!response.ok) {
    throw new Error("Invalid 2FA code.");
  }
}

export const updateAvatar = async (file: File) => {
  const avatar = new FormData();
  avatar.append('avatar', file);
  const response = await fetch('http://localhost:5000/users/update-avatar', {
    method: 'POST',
    credentials: 'include',
    body: avatar
  });

  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(errorJson.message || 'Unknown error');
  }

  return response.json();
};

export const setAvatarSelected = async () => {
  const response = await fetch(`http://localhost:5000/users/set-avatar-selected`, {
    method: 'PUT',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(errorJson.message || 'Unknown error');
  }
  return response.json();
};



export const getUserProfile = () => baseRequest("/users/profile", "GET");

export const logout = () => baseRequest("/users/logout", "GET");

export const enableTwoFA = () => baseRequest("/twofa/enable-2fa", "POST");

export const setTwoFAVerified = () => baseRequest("/twofa/set-2fa-verified", "POST");

export const disableTwoFA = () => baseRequest("/twofa/disable-2fa", "POST");

export const unsetTwoFAVerified = () => baseRequest("/twofa/unset-2fa-verified", "POST");

export const check2FA = () => baseRequest("/twofa/check-2fa", "GET");

export const check2FAVerified = () => baseRequest("/twofa/check-2fa-verified", "GET");

export const generateTwoFASecret = () => baseRequest("/twofa/generate-2fa-secret", "GET");