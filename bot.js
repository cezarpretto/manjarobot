const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')
const cheerio = require('cheerio')
const message = require('./messages')
const settings = require('./settings')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')


const bot = new TelegramBot(settings.token, { polling: true })


bot.on('new_chat_members', (msg) => {
  bot.sendMessage(msg.chat.id, 'Olá ' + msg.from.first_name + ',' + message.welcome)
})

bot.on('left_chat_participant', (msg) => {
  bot.sendMessage(msg.chat.id, 'Adeus ' + msg.from.first_name + ',' + message.by)
})

bot.onText(/\/help/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(msg.chat.id, message.details, { parse_mode: 'Markdown' }).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
})

bot.onText(/\/forum/, (msg) => {
  bot.sendMessage(msg.chat.id, message.forumLink, { parse_mode: 'Markdown' }).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
})

bot.onText(/\/instalacao/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(msg.chat.id, message.instalacaoLink, { parse_mode: 'Markdown' }).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
})

bot.onText(/\/gnome/, (msg) => {
  bot.sendMessage(msg.chat.id, message.gnomeAnswer, { parse_mode: 'Markdown' })
})

bot.onText(/\/grubrescue/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(msg.chat.id, message.grub).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
})

bot.onText(/\/mirror/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(msg.chat.id, message.mirror, { parse_mode: 'Markdown' }).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
})

bot.onText(/\/comandosbasicos/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(msg.chat.id, message.comandosAnswer).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
})

bot.onText(/\/regras/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(msg.chat.id, message.rules, { parse_mode: 'Markdown' }).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
})

bot.onText(/\/botcomandos/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(msg.chat.id, message.botComandos, { parse_mode: 'Markdown' }).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
})


bot.onText(/\/awesomelinux/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(msg.chat.id, message.aweLinks, { parse_mode: 'Markdown' }).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
})

bot.onText(/\/kerneldriver/, (msg) => {
  const userID = msg.from.id
  bot.sendMessage(msg.chat.id, message.kernelLink, { parse_mode: 'Markdown' }).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
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

bot.onText(/\/espaco/, (msg) => {
  bot.sendMessage(msg.chat.id, message.espaco, { parse_mode: 'Markdown' })
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
    bot.sendMessage(msg.chat.id, data.join('\n')).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
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
    bot.sendMessage(msg.chat.id, data.join('\n')).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
  }).catch((error) => {
    console.log(error)
  })
})

bot.onText(/\/menu/, (msg) => {
  const opts = {
    reply_markup: JSON.stringify({
      resize_keyboard: true,
      selective : true,
      one_time_keyboard: true,
      keyboard: [
        ['/regras', '/help', '/steam'],
        ['/instalacao', '/rollingrelease'],
        ['/rank', 'espaco'],
        ['/forum', '/kerneldriver'],
        ['/gnome', '/grubrescue'],
        ['/mirror', '/comandosbasicos'],
        ['/awesomelinux', '/arch']
      ]
    })
  }
  const userID = msg.from.id
  bot.sendMessage(userID, 'Escolha uma Opção', opts).catch((error) => { bot.sendMessage(msg.chat.id, 'Ei ' + msg.from.first_name + ', ' + message.before) })
})

// Parte relacionada aos elogios

bot.onText(/\/elogiar (.+)/, (msg, match) => {
  const chatID = msg.chat.id
  const userID = msg.from.id
  const userNICK = msg.from.username
  const user = match[1]; // mensagem capturada
  if (chatID == userID) {
    bot.sendMessage(chatID, message.elogioGrupo)
  } else {
    if (userNICK === user.slice(1, user.length)) {
      bot.sendMessage(chatID, message.autoElogio)
    } else {
      commend(user)
      bot.sendMessage(chatID, message.enviaElogio)
    }
  }
})

bot.onText(/\/contar (.+)/, (msg, match) => {
  const chatID = msg.chat.id
  const user = match[1]; // mensagem capturada
  countCommends(user, chatID)
})

bot.onText(/\/rank/, (msg) => {
  const chatID = msg.chat.id
  bestCommends(chatID)
})


////////// FUNÇÕES DO BANCO DE DADOS

// faz elogio ao usuário
function commend(nick) {
  MongoClient.connect(settings.database, function (err, client) {
    assert.equal(null, err);
    const db = client.db(settings.dbName)
    const collection = db.collection('avaliacao')
    // Procura ver se o usuário já foi elogiado alguma vez
    collection.find({ 'nick': nick }).toArray(function (err, docs) {
      assert.equal(err, null)
      if (docs.length === 0) {
        // Se não foi elogiado cadastra ele
        collection.insertMany([
          { 'nick': nick, 'commend': 1 }
        ], function (err, result) {
          assert.equal(err, null)
        })
      } else {
        // Se foi elogiado adiciona mais um elogio
        collection.updateOne({ 'nick': nick }
          , { $inc: { 'commend': 1 } }, function (err, result) {
            assert.equal(err, null)
          })
      }
      client.close()
    })
  })
}

// conta a quantidade de elogios de um usuário 
function countCommends(nick, chatID) {
  MongoClient.connect(settings.database, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server")
    const db = client.db(settings.dbName)
    const collection = db.collection('avaliacao')
    // Procura ver se o usuário já foi elogiado alguma vez
    collection.find({ 'nick': nick }).toArray(function (err, docs) {
      assert.equal(err, null)
      if (docs.length === 0) {
        bot.sendMessage(chatID, nick + message.semElogio)
      } else {
        bot.sendMessage(chatID, message.contaElogio + nick + ' é ' + docs[0].commend)
      }
      client.close()
    })
  })
}

//melhores avaliações
function bestCommends(chatID) {
  MongoClient.connect(settings.database, function (err, client) {
    assert.equal(null, err)
    console.log("Connected successfully to server")
    const db = client.db(settings.dbName)
    const collection = db.collection('avaliacao');
    // Procura ver se o usuário já foi elogiado alguma vez
    collection.find().sort({ 'commend': -1 }).limit(10).toArray(function (err, docs) {
      assert.equal(err, null)
      var text = 'Rank\n'
      for (let index = 0; index < docs.length; index++) {
        const element = docs[index]
        console.log(element)
        
        text += element.nick + ': ' + element.commend + ' elogios.\n'
        console.log(text)
        
      }
      bot.sendMessage(chatID, String(text))
      client.close()
    })
  })
}

