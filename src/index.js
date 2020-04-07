const express = require('express')
const fetch = require('node-fetch')

const app = express()

const PORT = process.env.PORT || 80
const BASE_URL = 'https://discordapp.com/api'

app.get('/', (req, res) => {
  res.json({ message: "Hello World" })
})
 
// TODO: Add pagination to get information from guilds with more than 1000 members
app.get('/contributors', async (req, res) => {
  const rolesResponse = await fetch(`${BASE_URL}/guilds/${process.env.GUILD_ID}/roles`, { headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` } }).then(res => res.json())
  const membersResponse = await fetch(`${BASE_URL}/guilds/${process.env.GUILD_ID}/members?limit=1000`, { headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` } }).then(res => res.json())

  const roles = rolesResponse
    .filter(r => r.hoist)
    .sort((a, b) => b.position - a.position)
    .map(role => {
      return {
        id: role.id,
        name: role.name,
        members: membersResponse.map(member => {
          if (member.roles.includes(role.id) && !member.user.bot) {
            const { user: { username, discriminator, avatar, id } } = member
            return { username, discriminator, id, avatar }
          }
        }).filter(u => u)
      }
    }).filter(r => r.members.length > 0)

  res.json({ roles })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})