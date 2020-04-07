const express = require('express')
const DiscordAPI = require('../api/Discord')
const router = express.Router()

module.exports = () => {
  // TODO: Add pagination to get information from guilds with more than 1000 members
  router.get('/contributors', async (_, res) => {
    const rolesResponse = await DiscordAPI.request(`guilds/${process.env.GUILD_ID}/roles`)
    const membersResponse = await DiscordAPI.request(`guilds/${process.env.GUILD_ID}/members?limit=1000`)
  
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

  return router
}

