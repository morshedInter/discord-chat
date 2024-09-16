
import axios from 'axios';
import { useState } from 'react';

const InviteForm = () => {
  const [discordId, setDiscordId] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // console.log(discordId, email);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/invite-client', { discordId, email });
      setMessage('Client invited successfully.');
    } catch (error) {
      console.error('Error inviting client:', error);
      setMessage('Failed to invite client.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Discord ID:</label>
        <input
          type="text"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Invite Client</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default InviteForm;
