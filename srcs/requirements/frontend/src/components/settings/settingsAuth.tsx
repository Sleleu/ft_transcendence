import { useState, useEffect } from 'react';
import { enableTwoFA, disableTwoFA } from '../Api';
import TwoFASetup from './TwoFASetup';

const SettingsAuth = () => {
  const [otpauthUrl, setOtpauthUrl] = useState(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/twofa/generate-2fa-secret", {
        method: "GET",
        credentials: 'include'
      });

      if (response.ok) {
        await response.text();
        setOtpauthUrl(otpauthUrl);
      } else {
        console.error("Error fetching 2FA secret:", response.status, response.statusText);
      }

      //check si le 2fa est activé par le compte
      const responseStatus = await fetch("http://localhost:5000/twofa/check-2fa", {
        method: "GET",
        credentials: 'include'
      });

      if (responseStatus.ok) {
        const status = await responseStatus.json();
        console.log("status = ", status)
        setTwoFAEnabled(status);
      } else {
        console.error("Error fetching 2FA status:", responseStatus.status, responseStatus.statusText);
      }
    }

    fetchData();
  }, []);

  const handleEnableTwoFA = async () => {
    try {
      await enableTwoFA();
      alert('Two-factor authentication enabled successfully');
      setTwoFAEnabled(true);
    } catch (error) {
      console.error(error);
      alert('Failed to enable two-factor authentication');
    }
  };

  const handleDisableTwoFA = async () => {
    try {
      await disableTwoFA();
      alert('Two-factor authentication disabled successfully');
      setTwoFAEnabled(false);
    } catch (error) {
      console.error(error);
      alert('Failed to disable two-factor authentication');
    }
  };

  return (
    <>
      <p className='text bold'>2F authentication</p>
      { twoFAEnabled === false && <button onClick={handleEnableTwoFA}>Enable Two Factor Authentication</button> }
	  { twoFAEnabled === true && <button onClick={handleDisableTwoFA}>Disable Two Factor Authentication</button> }
      {twoFAEnabled && <TwoFASetup />}
    </>
  );
}

export default SettingsAuth;
