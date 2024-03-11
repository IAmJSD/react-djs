import discord from "discord.js";
import React from "react";
import { Renderer, Storage } from "./Renderer";
import DefaultStorage from "./DefaultStorage";

// Export Storage.
export { Storage };

// Export out all of the relevant components.
export * from "./components";

export class RenderManager {
    private _storage: Storage;

    // Configures Discord events. This should be the main entry point for the library. This should run before
    // any other Discord event handlers.
    constructor(private client: discord.Client, storage?: Storage) {
        this._storage = storage ?? new DefaultStorage();
        client.on("messageDelete", (msg) => {
            const renderer = this._storage.get(msg.channelId, msg.id);
            if (renderer) renderer.kill();
        });
        client.on("interactionCreate", this._handleInteractions.bind(this));
    }

    // Handles interactions that are related to things we are rendering.
    private async _handleInteractions(interaction: discord.Interaction) {
        // Check the interaction type.
        if (!interaction.isMessageComponent()) return;

        // Try to get the renderer.
        const renderer = this._storage.get(interaction.channelId, interaction.message.id);
        if (renderer) {
            // Handle the interaction.
            await renderer.handleInteraction(interaction);
        }
    }

    // Handles the creation of a new message.
    async create(
        channel: discord.TextBasedChannel,
        node: React.ReactNode,
    ): Promise<discord.Message> {
        // Create the renderer.
        const renderer = new Renderer(this.client, this._storage, node);

        // Get the message reply.
        const msg = await channel.send(renderer.reactWrapper.result);

        // Mark the renderer as ready.
        renderer.ready(msg.channelId, msg.id);

        // Return the message.
        return msg;
    }

    // Handles replying to messages or interactions.
    async reply(
        message: discord.Message,
        node: React.ReactNode,
    ): Promise<discord.Message>;
    async reply(
        interaction: discord.CommandInteraction,
        node: React.ReactNode,
        opts?: { ephemeral: boolean },
    ): Promise<discord.Message>;
    async reply(
        interactionOrMsg: discord.Message | discord.CommandInteraction,
        node: React.ReactNode,
        opts?: { ephemeral: boolean },
    ): Promise<discord.Message> {
        // Create the renderer.
        const renderer = new Renderer(this.client, this._storage, node);

        // Get the message reply.
        const msg = await interactionOrMsg.reply({
            fetchReply: true,
            ephemeral: opts?.ephemeral,
            ...renderer.reactWrapper.result,
        });

        // Mark the renderer as ready.
        renderer.ready(msg.channelId, msg.id);

        // Return the message.
        return msg;
    }
}
