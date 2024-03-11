import React from "react";
import Node from "../Node";
import { MessageState } from "../../Renderer";
import { EmbedBuilder } from "discord.js";
import TextNode from "../TextNode";
import { omit } from "../../reacordHelpers";
import ReactDJSElement from "../ReactDJSElement";
import EmbedChildNode from "./EmbedChildNode";

/**
 * @category Embed
 * @see https://discord.com/developers/docs/resources/channel#embed-object
 */
export interface EmbedProps {
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
    author?: { name: string; url?: string; iconUrl?: string };
    thumbnail?: { url: string };
    image?: { url: string };
    video?: { url: string };
    footer?: { text: string; iconUrl?: string };
    timestamp?: string | number | Date;
    children?: React.ReactNode;
}

class EmbedNode extends Node<EmbedProps> {
    applyToMessageState(state: MessageState) {
        const embed = new EmbedBuilder({
            ...omit(this.props, ["children", "timestamp"]),
            timestamp: this.props.timestamp
                ? new Date(this.props.timestamp).toISOString()
                : undefined,
        });

        for (const child of this.children) {
            if (child instanceof EmbedChildNode) {
                child.modifyEmbedOptions(embed);
            }
            if (child instanceof TextNode) {
                embed.data.description =
                    (embed.data.description ?? "") + child.props;
            }
        }

        state.embeds.push(embed);
    }
}

/**
 * @category Embed
 * @see https://discord.com/developers/docs/resources/channel#embed-object
 */
export function Embed(props: EmbedProps) {
    return (
        <ReactDJSElement props={props} createNode={() => new EmbedNode(props)}>
            {props.children}
        </ReactDJSElement>
    );
}
