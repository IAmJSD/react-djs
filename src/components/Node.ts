import { MessageComponentInteraction } from "discord.js";
import { MessageState } from "../Renderer";

export default class Node<Props> {
    children: Node<unknown>[] = [];

    constructor(public props: Props) {}

    async onMessageInteraction(interaction: MessageComponentInteraction) {
        return false;
    }

    applyToMessageState(state: MessageState) {}

    get text(): string {
        return [...this.children].map((child) => child.text).join("");
    }
}
