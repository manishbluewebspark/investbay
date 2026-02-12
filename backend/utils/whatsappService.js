// Pure Node.js - No extra packages needed!
export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const response = await fetch(
      `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: process.env.ULTRAMSG_API_KEY,
          to: phoneNumber,
          body: message
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('WhatsApp Error:', error.message);
    return null;
  }
};

