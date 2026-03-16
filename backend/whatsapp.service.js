// whatsapp.service.js
import pkg from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

const { Client, LocalAuth } = pkg

let client = null

export async function connectWhatsApp() {
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      executablePath: '/snap/bin/chromium', // ✅ Yahi sahi path hai
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    }
  })

  client.on('qr', (qr) => {
    console.log('\n📱 Scan this QR Code in WhatsApp:\n')
    qrcode.generate(qr, { small: true })
  })

  client.on('loading_screen', (percent, message) => {
    console.log(`⏳ Loading: ${percent}% - ${message}`)
  })

  client.on('authenticated', () => {
    console.log('🔐 Authenticated!')
  })

  client.on('ready', () => {
    console.log('✅ WhatsApp Connected Successfully!')
  })

  client.on('disconnected', (reason) => {
    console.log('❌ Disconnected:', reason)
    connectWhatsApp()
  })

  await client.initialize()
}

export const getClient = () => client



// export const connectWhatsApp = async () => {
//   console.log('✅ AiSensy Official WhatsApp API Ready!')
// }