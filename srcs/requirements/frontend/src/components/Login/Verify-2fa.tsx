import React, { useState, ChangeEvent, FormEvent } from "react";

interface Verify2FAProps {
  onVerifySuccess: () => void;
}

const Verify2FA: React.FC<Verify2FAProps> = (props) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
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
      await fetch("http://localhost:5000/twofa/enable-2fa-verified", {
        method: "POST",
        credentials: 'include'
      });
      setError(null);
      props.onVerifySuccess(); // appel à la fonction de rappel
    } catch (error) {
      setError("Invalid 2FA code.");
      setMessage(null);
    }
  };

  return (
    <div>
      <h1>Verify 2FA</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your 2FA code:
          <input type="text" onChange={handleInputChange} value={code} />
        </label>
        <button type="submit">Verify</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}

export default Verify2FA;
