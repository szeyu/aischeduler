// JamaiValidation.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

interface JamaiValidationProps {
  onValidation: (isValid: boolean) => void;
}

const JamaiValidation: React.FC<JamaiValidationProps> = ({ onValidation }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidation = async () => {
    setIsValidating(true);
    setError(null);

    try {
      const response = await axios.get('https://api.jamaibase.com/api/v1/models', {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${apiKey}`,
          'X-PROJECT-ID': 'test'
        },
        validateStatus: (status) => status === 404 // Treat 404 as a valid response
      });

      console.log(response);

      if (response.status === 404) {
        console.log('API key is valid');
        toast.success("API key is valid");
        onValidation(true);
      } else {
        console.log('Unexpected response status:', response.status);
        setError('Invalid API key. Please try again.');
        onValidation(false);
      }
    } catch (error) {
      console.error('Error during validation:', error);
      setError('An error occurred. Please try again.');
      onValidation(false);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="jamai-validation">
      <h3>Sign Up Jamai Base for AI Suggestion!</h3>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your Jamai API Key"
      />
      <button onClick={handleValidation} disabled={isValidating}>
        {isValidating ? 'Validating...' : 'Validate'}
      </button>
      {error && <p className="error">{error}</p>}
      <a
        href="https://cloud.jamaibase.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="jamai-signup-link"
      >
        Sign up for Jamai Base
      </a>
    </div>
  );
};

export default JamaiValidation;