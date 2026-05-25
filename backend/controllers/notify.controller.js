// import { getAllActiveSubscribers } from '../queries/subscriber.queries.js'
// import { sendBulkMessages } from '../bulkMessage.js'

// export const notifySubscribers = async (req, res) => {
//   try {
//     const { postTitle, postLink } = req.body

//     const subscribers = await getAllActiveSubscribers()

//     if (subscribers.length === 0) {
//       return res.json({ success: false, message: 'No active subscribers found' })
//     }

//     const message = `📢 *New Post Alert!*\n\n*${postTitle}*\n\n🔗 Padho yahan:\n${postLink}`

//     sendBulkMessages(subscribers, message)

//     res.json({ success: true, message: `Sending to ${subscribers.length} subscribers` })

//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// }



import { getAllActiveSubscribers } from '../queries/subscriber.queries.js'
import { sendBulkMessages } from '../bulkMessage.js'

export const notifySubscribers = async (req, res) => {
  try {
    const { postTitle, postLink, content, imageUrl } = req.body

    const subscribers = await getAllActiveSubscribers()

    if (subscribers.length === 0) {
      return res.json({ success: false, message: 'No active subscribers found' })
    }

    // ✅ Message format - jo chahiye wo bhejo
    const message = `📢 *${postTitle}*

    ${content ? content + '\n' : ''}${postLink ? `🔗 ${postLink}` : ''}`

    await sendBulkMessages(subscribers, message, imageUrl)

    res.json({ success: true, message: `Sending to ${subscribers.length} subscribers` })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}



// import { getAllActiveSubscribers } from '../queries/subscriber.queries.js'
// import { sendBulkMessages } from '../bulkMessage.js'

// export const notifySubscribers = async (req, res) => {
//   try {
//     const { postTitle, postLink, content } = req.body

//     if (!postTitle || !postLink || !content) {
//       return res.status(400).json({
//         error: 'postTitle, content aur postLink required hain'
//       })
//     }

//     const subscribers = await getAllActiveSubscribers()

//     if (subscribers.length === 0) {
//       return res.json({
//         success: false,
//         message: 'No active subscribers found'
//       })
//     }

//     const message = `📢 ${postTitle} | ${content} | ${postLink}`

//     // Background me bhejo
//     sendBulkMessages(subscribers, message, postTitle, content, postLink)

//     res.json({
//       success: true,
//       message: `Sending to ${subscribers.length} subscribers`
//     })

//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// }