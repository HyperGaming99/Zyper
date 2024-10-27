const Enmap = require('enmap');

class BlacklistBanManager {
    constructor(client) {
        if (!client) {
            throw new Error("Eine Discord.js Client-Instanz ist erforderlich.");
        }
        this.client = client;
        this.bans = new Enmap({ name: 'bans' });
    }

    /**
     * Füge einen Benutzer zur Bannliste einer spezifischen Guild hinzu und banne ihn auf Discord.
     * @param {string} guildId - Die ID der Guild.
     * @param {string} userId - Die ID des Benutzers, der gebannt werden soll.
     * @param {string} reason - Der Grund für den Bann.
     */
    async addBan(guildId, userId, reason = 'Kein Grund angegeben') {
        if (!this.bans.has(guildId)) {
            this.bans.set(guildId, {});
        }
        const guildBans = this.bans.get(guildId);
        if (guildBans[userId]) {
            throw new Error(`Benutzer mit der ID ${userId} ist bereits in Guild ${guildId} gebannt.`);
        }

        try {
            const guild = await this.client.guilds.fetch(guildId);
            await guild.members.ban(userId, { reason });
            guildBans[userId] = { reason, date: new Date() };
            this.bans.set(guildId, guildBans);
            console.log(`Benutzer ${userId} wurde in Guild ${guildId} gebannt.`);
        } catch (error) {
            console.error(`Fehler beim Bannen des Benutzers ${userId} in Guild ${guildId}:`, error);
        }
    }

    /**
     * Entferne einen Benutzer von der Bannliste einer spezifischen Guild und entbanne ihn auf Discord.
     * @param {string} guildId - Die ID der Guild.
     * @param {string} userId - Die ID des Benutzers, der entbannt werden soll.
     */
    async removeBan(guildId, userId) {
        if (!this.bans.has(guildId)) {
            throw new Error(`Guild mit der ID ${guildId} hat keine Bans.`);
        }
        const guildBans = this.bans.get(guildId);
        if (!guildBans[userId]) {
            throw new Error(`Benutzer mit der ID ${userId} ist in Guild ${guildId} nicht gebannt.`);
        }

        try {
            const guild = await this.client.guilds.fetch(guildId);
            await guild.members.unban(userId);
            delete guildBans[userId];
            this.bans.set(guildId, guildBans);
            console.log(`Benutzer ${userId} wurde in Guild ${guildId} entbannt.`);
        } catch (error) {
            console.error(`Fehler beim Entbannen des Benutzers ${userId} in Guild ${guildId}:`, error);
        }
    }

    /**
     * Überprüfen, ob ein Benutzer in einer bestimmten Guild gebannt ist.
     * @param {string} guildId - Die ID der Guild.
     * @param {string} userId - Die ID des Benutzers.
     * @returns {boolean} - True, wenn der Benutzer in dieser Guild gebannt ist.
     */
    isBanned(guildId, userId) {
        const guildBans = this.bans.get(guildId) || {};
        return Boolean(guildBans[userId]);
    }

    /**
     * Erhalte die Banninformationen eines Benutzers in einer spezifischen Guild.
     * @param {string} guildId - Die ID der Guild.
     * @param {string} userId - Die ID des Benutzers.
     * @returns {Object|null} - Banninformationen oder null, falls der Benutzer nicht gebannt ist.
     */
    getBanInfo(guildId, userId) {
        const guildBans = this.bans.get(guildId) || {};
        return guildBans[userId] || null;
    }

    /**
     * Liste alle gebannten Benutzer einer bestimmten Guild auf.
     * @param {string} guildId - Die ID der Guild.
     * @returns {Array} - Eine Liste von Objekten mit Benutzerinformationen.
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
