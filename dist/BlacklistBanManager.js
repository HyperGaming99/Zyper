const Enmap = require('enmap');

class BlacklistBanManager {
    constructor(client) {
        if (!client) {
            throw new Error("A Discord.js client instance is required.");
        }
        this.client = client;
        this.bans = new Enmap({ name: 'bans' });
    }

    /**
     * Add a user to the ban list of a specific guild and ban them on Discord.
     * @param {string} guildId - The ID of the guild.
     * @param {string} userId - The ID of the user to be banned.
     * @param {string} reason - The reason for the ban.
     */
    async addBan(guildId, userId, reason = 'No reason provided') {
        if (!this.bans.has(guildId)) {
            this.bans.set(guildId, {});
        }
        const guildBans = this.bans.get(guildId);
        if (guildBans[userId]) {
            throw new Error(`User with ID ${userId} is already banned in guild ${guildId}.`);
        }

        try {
            const guild = await this.client.guilds.fetch(guildId);
            await guild.members.ban(userId, { reason });
            guildBans[userId] = { reason, date: new Date() };
            this.bans.set(guildId, guildBans);
            console.log(`User ${userId} has been banned in guild ${guildId}.`);
        } catch (error) {
            console.error(`Error banning user ${userId} in guild ${guildId}:`, error);
        }
    }

    /**
     * Remove a user from the ban list of a specific guild and unban them on Discord.
     * @param {string} guildId - The ID of the guild.
     * @param {string} userId - The ID of the user to be unbanned.
     */
    async removeBan(guildId, userId) {
        if (!this.bans.has(guildId)) {
            throw new Error(`Guild with ID ${guildId} has no bans.`);
        }
        const guildBans = this.bans.get(guildId);
        if (!guildBans[userId]) {
            throw new Error(`User with ID ${userId} is not banned in guild ${guildId}.`);
        }

        try {
            const guild = await this.client.guilds.fetch(guildId);
            await guild.members.unban(userId);
            delete guildBans[userId];
            this.bans.set(guildId, guildBans);
            console.log(`User ${userId} has been unbanned in guild ${guildId}.`);
        } catch (error) {
            console.error(`Error unbanning user ${userId} in guild ${guildId}:`, error);
        }
    }

    /**
     * Check if a user is banned in a specific guild.
     * @param {string} guildId - The ID of the guild.
     * @param {string} userId - The ID of the user.
     * @returns {boolean} - True if the user is banned in this guild.
     */
    isBanned(guildId, userId) {
        const guildBans = this.bans.get(guildId) || {};
        return Boolean(guildBans[userId]);
    }

    /**
     * Get the ban information of a user in a specific guild.
     * @param {string} guildId - The ID of the guild.
     * @param {string} userId - The ID of the user.
     * @returns {Object|null} - Ban information or null if the user is not banned.
     */
    getBanInfo(guildId, userId) {
        const guildBans = this.bans.get(guildId) || {};
        return guildBans[userId] || null;
    }

    /**
     * List all banned users in a specific guild.
     * @param {string} guildId - The ID of the guild.
     * @returns {Array} - A list of objects with user information.
     */
    listBans(guildId) {
        const guildBans = this.bans.get(guildId) || {};
        return Object.entries(guildBans).map(([userId, banInfo]) => ({
            userId,
            ...banInfo,
        }));
    }
}

module.exports = BlacklistBanManager;
