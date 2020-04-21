const fetch = require('node-fetch')
// TODO: chnage to axios

const BASE_URL = 'https://discordapp.com/api'

module.exports = class DiscordAPI {
  static async request (endpoint) {
    return fetch(`${BASE_URL}/${endpoint}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    }).then(res => res.json())
  }
}
