import { useState, useEffect, ChangeEvent } from 'react';

const TwoFASetup = ({ onVerification }: { onVerification: (isVerified: boolean) => void }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/twofa/generate-2fa-secret", {
        method: "GET",
        credentials: 'include'
      });

      if(response.ok) {
        const data = await response.text();
        setQrCodeUrl(data);
      } else {
        console.error("Error fetching 2FA secret:", response.status, response.statusText);
      }
    }

    fetchData();
  }, []);

  const handleCodeChange = (event : ChangeEvent<HTMLInputElement>) => {
    setTwoFACode(event.target.value);
  };

  const verifyCode = async () => {
    try {
      const response = await fetch("http://localhost:5000/twofa/confirm-enable-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: twoFACode }),
        credentials: 'include'
      });
      if(response.ok) {
        setIsVerified(true);
        onVerification(true);
      } else {
        setErrorMessage('Invalid 2FA code')
      }
    } catch (error) {
      console.error(error);
      alert('An Error occured verifying the 2FA code');
    }
  };

  return (
    <div>
      {!isVerified && qrCodeUrl && (
        <>
          <p className='text bold'>Please add this QR code to your Two-Factor Authentication app (like Google Authenticator). 
          The two-factor authentication will be activated once the code is validated.</p>
          <img src={qrCodeUrl} alt="QR code" />
          <input type="text" value={twoFACode} onChange={handleCodeChange} placeholder="Enter your 2FA code" />
          <button onClick={verifyCode}>Verify Code</button>
          {errorMessage && <p className="text bold neon-red">{errorMessage}</p>}
        </>
      )}
    </div>
  );
};

export default TwoFASetup;

