import { useState, useEffect } from 'react';

const TwoFASetup = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

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

  return (
    <div>
      {qrCodeUrl && (
        <img src={qrCodeUrl} alt="QR code" />
      )}
    </div>
  );
};

export default TwoFASetup;

