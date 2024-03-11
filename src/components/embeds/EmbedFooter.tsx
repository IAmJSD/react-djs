import React from "react";
import ReactDJSElement from "../ReactDJSElement";
import Node from "../Node";
import EmbedChildNode from "./EmbedChildNode";
import { findType } from "../../helpers";
import { EmbedBuilder } from "discord.js";

/** @category Embed */
export interface EmbedFooterProps {
    text?: React.ReactNode;
    children?: React.ReactNode;
    iconUrl?: string;
    timestamp?: string | number | Date;
}

/** @category Embed */
export function EmbedFooter({ text, children, ...props }: EmbedFooterProps) {
    return (
        <ReactDJSElement
            props={props}
            createNode={() => new EmbedFooterNode(props)}
        >
            <ReactDJSElement
                props={{}}
                createNode={() => new FooterTextNode({})}
            >
                {text ?? children}
            </ReactDJSElement>
        </ReactDJSElement>
    );
}

class EmbedFooterNode extends EmbedChildNode<
    Omit<EmbedFooterProps, "text" | "children">
> {
    override modifyEmbedOptions(options: EmbedBuilder): void {
        options.setFooter({
            text: findType(this.children, FooterTextNode)?.text ?? "",
            iconURL: this.props.iconUrl,
        });
        options.setTimestamp(
            this.props.timestamp ? new Date(this.props.timestamp) : undefined,
        );
    }
}

class FooterTextNode extends Node<Record<string, never>> {}
