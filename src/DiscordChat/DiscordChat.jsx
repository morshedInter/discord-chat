
import axios from "axios";
import { useState } from "react";

export const DiscordChat = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // To show success or error message

  // direct chat in inbox
  const DiscordChatButton = () => {
    const handleRedirect = () => {
      // Redirect to Discord chat with the admin
      window.open(`https://discordapp.com/users/704810750140481618`, '_blank');
    };
  
    return (
      <button onClick={handleRedirect}>
        Chat with Admin on Discord
      </button>
    );
  };
  
  
  const sendMessageToDiscord = async () => {
    const channelId = "1284458664274432031"; 

    try {
      const response = await axios.post("http://localhost:5000/discord-message", {
        channelId,
        message,
      });
      if (response.status === 200) {
        setStatus("Message sent successfully!");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setStatus("Failed to send message. Please try again.");
    }
  };

// const redirectToDiscord = async() =>{
//   const channelId = "1284458664274432031";
//   const defaultMessage = "Hello sir! I am just testing my Discord bot. I have been working on it for a while now. I am so happy to see you!";
//   try{
//     const res = await axios.post("http://localhost:5000/discord-message", {
//       channelId,
//       message: defaultMessage
//     })
//     if(res.status === 200){
//       window.location.href = "https://discord.com/channels/1284458199482630196/1284458664274432031";
    
//     }
//   } catch(error){
//     console.error("Failed to send message:", error);
//   }
// }

  return (
    <div className="max-w-[750px] mx-auto flex flex-col items-center justify-center py-10">
      <h1 className="text-red-600 text-2xl py-5">Chat with Admin</h1>
      {/* <textarea className="border border-gray-300 rounded p-2 w-full"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", height: "100px" }}
      /> */}
      <br />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={sendMessageToDiscord}>Send Message</button>
      <p>{status}</p>
    </div>
  );
};


// import  { useState, useEffect } from 'react';
// import axios from 'axios';

// function App() {
//   const [botStatus, setBotStatus] = useState('Loading...');

//   useEffect(() => {
//     // Fetch bot status from the backend (this can be customized based on your needs)
//     axios.get('http://localhost:3000/api/bot-status')
//       .then(response => setBotStatus(response.data.status))
//       .catch(() => setBotStatus('Offline'));
//   }, []);

//   const connectToBot = () => {
//     // Handle interaction with bot through frontend if needed
//     // alert('Message the bot on Discord to start a chat.');

//     // Redirect to Discord
//     // window.location.href = 'https://discord.com/channels/1284458199482630196/1284458664274432031';
//   };
//   // const showConnectOptions = () => {
//   //   // alert('Connect with us on:\n1. Facebook\n2. LinkedIn\n3. Website');

//   //   // Redirect to Discord
//   //   window.location.href = 'https://discord.com/channels/1284458199482630196/1284458664274432031';
//   // };

//   return (
//     <div className="App">
//       <h1>Discord Bot Status</h1>
//       <p>{botStatus}</p>
//       <button onClick={showConnectOptions}>Chat with Bot</button>
//     </div>
//   );
// }

// export default App;


