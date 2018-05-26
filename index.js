const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const cheerio = require('cheerio')
const message = require('./messages')
const settings = require('./settings')

const bot = new TelegramBot(settings.token, {polling: true})


bot.on('new_chat_members', (msg) => {
  bot.sendMessage(msg.chat.id, 'Olá ' +msg.from.first_name + ',' + message.welcome)
})

bot.on('left_chat_participant', (msg) => {
  bot.sendMessage(msg.chat.id,'Adeus ' + msg.from.first_name +',' + message.by)
})

bot.onText(/\/help/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(userID, message.details, { parse_mode: 'Markdown' }).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
})

bot.onText(/\/forum/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(userID, message.forumLink, { parse_mode: 'Markdown' }).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
})

bot.onText(/\/instalacao/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(userID, message.instalacaoLink, { parse_mode: 'Markdown' }).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
})

bot.onText(/\/gnome/, (msg) => {
  bot.sendMessage(msg.chat.id, message.gnomeAnswer, { parse_mode: 'Markdown' })
})

bot.onText(/\/grubrescue/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(userID, message.grub).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
})

bot.onText(/\/mirror/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(userID, message.mirror, { parse_mode: 'Markdown' }).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
})

bot.onText(/\/comandosbasicos/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(userID, message.comandosAnswer).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
})

bot.onText(/\/regras/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(userID, message.rules, { parse_mode: 'Markdown' }).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
})

bot.onText(/\/awesomelinux/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(userID, message.aweLinks, { parse_mode: 'Markdown' }).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
})

bot.onText(/\/kerneldriver/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(userID, message.kernelLink, { parse_mode: 'Markdown' }).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
})

bot.onText(/\/steam/, (msg) => {
  bot.sendMessage(msg.chat.id, message.steam, { parse_mode: 'Markdown' })
})

bot.onText(/\/arch/, (msg) => {
  bot.sendPhoto(msg.chat.id, message.photoLink)
})

bot.onText(/\/form/, (msg) => {
  bot.sendMessage(msg.chat.id, message.form, { parse_mode: 'Markdown' })
})


bot.onText(/\/rollingrelease/, (msg, match) => {
  const urlTec = `https://manjaro.org/get-manjaro/`
  const urlTec2 = `https://manjaro.org/community-editions/`

  axios.get(urlTec).then((response) => {
    const $ = cheerio.load(response.data)
    const data = [
      { name: 'RELEASES OFICIAIS' },
      { name: '  ' }
    ]
    $('h2').slice(0, 3).each((i, elm) => {
      data.push({
        name: $(elm).text()
      })
    })
    return data.map((el) => `${el.name}`)
  }).then((data) => {
    const userID = msg.from.id
    bot.sendMessage(userID, data.join('\n')).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
  }).catch((error) => {
    console.log(error)
  })

  axios.get(urlTec2).then((response) => {
    const $ = cheerio.load(response.data)
    const data = [
      { name: 'RELEASES DA COMUNIDADE' },
      { name: '  ' }
    ]
    $('.text > h2').each((i, elm) => {
      data.push({
        name: elm.children[0].data
      })
    })
    return data.map((el) => `${el.name}`)
  }).then((data) => {
    const userID = msg.from.id
    bot.sendMessage(userID, data.join('\n')).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
  }).catch((error) => {
    console.log(error)
  })
})

bot.onText(/\/menu/, (msg) => {
  const opts = {
    reply_markup: JSON.stringify({
      resize_keyboard: true,
      one_time_keyboard: true,
      keyboard: [
        [ '/regras', '/help', '/steam' ],
        [ '/instalacao', '/rollingrelease' ],
        [ '/forum', '/kerneldriver' ],
        [ '/gnome', '/grubrescue' ],
        [ '/mirror', '/comandosbasicos' ],
        [ '/awesomelinux', '/arch' ]
      ]
    })
  }
  const userID = msg.from.id
  bot.sendMessage(userID, 'Escolha uma Opção', opts).catch((error) => {bot.sendMessage(msg.chat.id,'Ei ' + msg.from.first_name +', '+  message.before)})
})
