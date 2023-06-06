import { useState, useEffect, ChangeEvent } from 'react';

const TwoFASetup = ({ onVerification }: { onVerification: (isVerified: boolean) => void }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [twoFACode, setTwoFACode] = useState('');

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
        const data = await response.json();
        alert(data.message);
        onVerification(true);
      } else {
        console.error("Error verifying 2FA code:", response.status, response.statusText);
      }
    } catch (error) {
      console.error(error);
      alert('An Error occured verifying the 2FA code');
    }
  };

  return (
    <div>
      {qrCodeUrl && (
        <>
          <img src={qrCodeUrl} alt="QR code" />
          <input type="text" value={twoFACode} onChange={handleCodeChange} placeholder="Enter your 2FA code" />
          <button onClick={verifyCode}>Verify Code</button>
        </>
      )}
    </div>
  );
};

export default TwoFASetup;

