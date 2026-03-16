// Pure Node.js - No extra packages needed!
// export const sendWhatsAppMessage = async (phoneNumber, message) => {
//   try {
//     const response = await fetch(
//       `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages/chat`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           token: process.env.ULTRAMSG_API_KEY,
//           to: phoneNumber,
//           body: message
//         })
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('WhatsApp Error:', error.message);
//     return null;
//   }
// };


export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    console.log(`📤 Sending WhatsApp to ${phoneNumber} via UltraMsg...`);
    
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
          body: message,
          priority: 10, // Optional: Higher priority
          referenceId: `signal_${Date.now()}` // Optional: For tracking
        })
      }
    );

    // Get the response data
    const data = await response.json();
    
    // UltraMsg returns status in the response body
    // Check if the message was sent successfully
    if (data.status === 'success' || data.sent === true) {
      console.log(`✅ WhatsApp message sent successfully to ${phoneNumber}`);
      return data;
    } else {
      // UltraMsg returns error details in the response
      const errorMsg = data.error || data.description || 'Unknown UltraMsg error';
      console.error(`❌ UltraMsg API error:`, data);
      throw new Error(`UltraMsg Error: ${errorMsg}`);
    }

  } catch (error) {
    console.error('❌ WhatsApp Error:', error.message);
    // 👇 IMPORTANT: Throw the error so the caller knows it failed
    throw error;
  }
};

