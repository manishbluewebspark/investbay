// // bulkMessage.js
// import { getClient } from './whatsapp.service.js'
// import { saveMessageLog } from './queries/messageLog.queries.js'

// export async function sendBulkMessages(subscribers, message) {
//   const client = getClient()
//   let sent = 0
//   let failed = 0

//   for (const subscriber of subscribers) {
//     try {
//       const number = `91${subscriber.phone}@c.us`

//       await client.sendMessage(number, message)
//       await saveMessageLog(subscriber.id, subscriber.phone, message, 'sent')

//       sent++
//       console.log(`✅ Sent to ${subscriber.phone}`)

//       // Delay - ban se bachne ke liye
//       await new Promise(res => setTimeout(res, 3000))

//     } catch (err) {
//       failed++
//       await saveMessageLog(subscriber.id, subscriber.phone, message, 'failed', err.message)
//       console.log(`❌ Failed: ${subscriber.phone}`)
//     }
//   }

//   return { sent, failed }
// }



import pkg from 'whatsapp-web.js' 
import { getClient } from './whatsapp.service.js'
import { saveMessageLog } from './queries/messageLog.queries.js'

const { MessageMedia } = pkg  

export async function sendBulkMessages(subscribers, message, imageUrl = null) {
  const client = getClient()
  let sent = 0
  let failed = 0

  for (const subscriber of subscribers) {
    try {
      const number = `91${subscriber.phone}@c.us`

      if (imageUrl) {
        // ✅ Image URL se media fetch karke bhejo
        const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true })
        await client.sendMessage(number, media, { caption: message })
      } else {
        // ✅ Sirf text bhejo
        await client.sendMessage(number, message)
      }

      await saveMessageLog(subscriber.id, subscriber.phone, message, 'sent')
      sent++
      console.log(`✅ Sent to ${subscriber.phone}`)

      await new Promise(res => setTimeout(res, 3000))

    } catch (err) {
      failed++
      await saveMessageLog(subscriber.id, subscriber.phone, message, 'failed', err.message)
      console.log(`❌ Failed: ${subscriber.phone}`)
    }
  }

  return { sent, failed }
}



// import { saveMessageLog } from './queries/messageLog.queries.js'

// export async function sendBulkMessages(subscribers, message, postTitle, content, postLink) {
//   let sent = 0
//   let failed = 0

//   for (const subscriber of subscribers) {
//     try {
//       const response = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           apiKey: process.env.AISENSY_API_KEY,
//           campaignName: process.env.AISENSY_CAMPAIGN_NAME,
//           destination: `91${subscriber.phone}`,
//           userName: subscriber.name || 'Subscriber',
//           templateParams: [
//             postTitle,  // {{1}}
//             content,    // {{2}}
//             postLink    // {{3}}
//           ],
//           source: 'investbay-platform',
//           media: {},
//           buttons: [],
//           carouselCards: [],
//           location: {}
//         })
//       })

//       const data = await response.json()

//       if (response.ok) {
//         await saveMessageLog(subscriber.id, subscriber.phone, message, 'sent')
//         sent++
//         console.log(`✅ Sent to ${subscriber.phone}`)
//       } else {
//         throw new Error(data.message || 'AiSensy API Error')
//       }

//       // Delay ban se bachne ke liye
//       await new Promise(res => setTimeout(res, 1000))

//     } catch (err) {
//       failed++
//       await saveMessageLog(
//         subscriber.id,
//         subscriber.phone,
//         message,
//         'failed',
//         err.message
//       )
//       console.log(`❌ Failed: ${subscriber.phone} — ${err.message}`)
//     }
//   }

//   return { sent, failed }
// }