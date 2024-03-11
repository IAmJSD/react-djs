import { EmbedBuilder } from "discord.js";
import Node from "../Node";

export default abstract class EmbedChildNode<Props> extends Node<Props> {
    abstract modifyEmbedOptions(options: EmbedBuilder): void;
}
