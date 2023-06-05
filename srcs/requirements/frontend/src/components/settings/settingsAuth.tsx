import { useState, useEffect } from 'react';
import { enableTwoFA, disableTwoFA, check2FA } from '../Api';
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
      const isTwoFAenabled : boolean = await check2FA();
      setTwoFAEnabled(isTwoFAenabled);
    }

    fetchData();
  }, []);

  const handleTwoFA = async (code : string) => {
    try {
      if (code === 'enable') {
      await enableTwoFA();
      alert('Two-factor authentication enabled successfully');
      setTwoFAEnabled(true);
      }
      else if (code === 'disable') {
        await disableTwoFA();
        alert('Two-factor authentication disabled successfully');
        setTwoFAEnabled(false);   
      }
    } catch (error) {
      console.error(error);
      alert('An Error occured with two-factor authentication');
    }
  };

  return (
    <>
      <p className='text bold'>2F authentication</p>
      { twoFAEnabled === false && <button className='button-2fa' onClick={() => handleTwoFA('enable')}>Enable Two Factor Authentication</button> }
	  { twoFAEnabled === true && <button className='button-2fa' onClick={() => handleTwoFA('disable')}>Disable Two Factor Authentication</button> }
      {twoFAEnabled && <TwoFASetup />}
    </>
  );
}

export default SettingsAuth;
