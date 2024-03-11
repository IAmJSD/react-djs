import discord from "discord.js";
import React from "react";
import ReactWrapper from "./ReactWrapper";

export interface Storage {
    get(channelId: string, messageId: string): any;
    set(channelId: string, messageId: string, value: any): void;
    delete(channelId: string, messageId: string): void;
}

export type MessageState = {
    content: string;
    embeds: discord.EmbedBuilder[];
    components: discord.ActionRowBuilder<discord.MessageActionRowComponentBuilder>[];
};

export class Renderer {
    public reactWrapper: ReactWrapper;

    // @ts-ignore: Passed by the renderer after.
    private _channelId: string;
    private _messageId: string | null = null;

    // Constructs the renderer in a non-ready state.
    constructor(
        private client: discord.Client,
        private storage: Storage,
        node: React.ReactNode,
    ) {
        this.reactWrapper = new ReactWrapper(
            this._reactUpdate.bind(this),
            node,
        );
    }

    // Handles interactions that are sent to the renderer.
    async handleInteraction(interaction: discord.MessageComponentInteraction) {
        // Get the message ID.
        const messageId = this._messageId;
        this._messageId = null;

        try {
            // Call the React wrapper.
            if (!(await this.reactWrapper.dispatchEvent(interaction))) {
                // Return here if the interaction was not handled.
                return;
            }

            // Wait for the zucc.
            await this.reactWrapper.waitForUpdate();

            // Handle hooking to the message.
            this._handleHooking();

            // Send the update to Discord.
            await interaction.update(this.reactWrapper.result);
        } finally {
            // Ensure the message ID is set back.
            this._messageId = messageId;
        }
    }

    // Handle checking if it needs to be hooked.
    private _handleHooking() {
        const components = this.reactWrapper.result.components;
        if (components.length > 0) {
            // Ensure it is in the storage.
            this.storage.set(this._channelId, this._messageId!, this);
        } else {
            // Ensure it is not in the storage.
            this.storage.delete(this._channelId, this._messageId!);
        }
    }

    // Handles if the message is updated from React.
    private async _reactUpdate(msg: MessageState) {
        // If there's no message ID, return. This means that the interaction is being handled in another way.
        if (!this._messageId) return;

        // Update the interaction.
        await this.client.channels
            .fetch(this._channelId)
            .then(async (channel) => {
                if (channel && channel.isTextBased()) {
                    await channel.messages
                        .fetch(this._messageId!)
                        .then(async (message) => {
                            await message.edit(msg);
                        });
                }
            });

        // Handle hooking to the message.
        this._handleHooking();
    }

    // Signals to the renderer that it can update the message and handle the cache now.
    ready(channelId: string, messageId: string) {
        this._channelId = channelId;
        this._messageId = messageId;
        this._handleHooking();
    }

    // Handles if this is killed.
    kill() {
        this._messageId = null;
        this.reactWrapper.kill();
        this.storage.delete(this._channelId, this._messageId!);
    }
}
