import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enableTwoFA } from '../Api';
import TwoFASetup from './TwoFASetup';

const SettingsAuth = () => {
  const navigate = useNavigate();
  const [otpauthUrl, setOtpauthUrl] = useState(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false); // Variable d'état pour suivre l'état du bouton

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/intra/generate-2fa-secret", {
        method: "GET",
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setOtpauthUrl(data.otpauthUrl);
      } else {
        console.error("Error fetching 2FA secret:", response.status, response.statusText);
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
      await enableTwoFA();
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
