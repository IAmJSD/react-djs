import { ActionRowBuilder, MessageActionRowComponentBuilder } from "discord.js";
import { MessageState } from "./Renderer";

export function findType<T>(a: any[], t: { new (...args: any[]): T }): T {
    return a.find((x) => x instanceof t) as T;
}

export function getNextActionRow(state: MessageState) {
    const last = state.components[state.components.length - 1];
    if (!last || last.components.length === 5) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        state.components.push(row);
        return row;
    }
    return last;
}
