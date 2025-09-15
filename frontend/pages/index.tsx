// research_chatbot/frontend/pages/index.tsx

// NOTE: You do NOT need: `import React from 'react'`
import Avatar from "../components/avatar";
import PrivacyBanner from "../components/PrivacyBanner";
import Chat from "../components/chat";

export default function Home() {
  const privacy = "on"; // keep your existing flags if you want
  return (
    <div style={{ padding: "1rem" }}>
      <PrivacyBanner privacy={privacy} />
      <Avatar privacy={privacy} />
      <Chat /> {/* no props required for the JS component */}
    </div>
  );
}
