import React from "react";
import ReactDJSElement from "../ReactDJSElement";
import EmbedChildNode from "./EmbedChildNode";
import { findType } from "../../helpers";
import Node from "../Node";
import { EmbedBuilder } from "discord.js";

/** @category Embed */
export interface EmbedTitleProps {
    children: React.ReactNode;
    url?: string;
}

/** @category Embed */
export function EmbedTitle({ children, ...props }: EmbedTitleProps) {
    return (
        <ReactDJSElement
            props={props}
            createNode={() => new EmbedTitleNode(props)}
        >
            <ReactDJSElement
                props={{}}
                createNode={() => new TitleTextNode({})}
            >
                {children}
            </ReactDJSElement>
        </ReactDJSElement>
    );
}

class EmbedTitleNode extends EmbedChildNode<Omit<EmbedTitleProps, "children">> {
    override modifyEmbedOptions(options: EmbedBuilder): void {
        options.setTitle(findType(this.children, TitleTextNode)?.text ?? "");
        options.setURL(this.props.url || null);
    }
}

class TitleTextNode extends Node<Record<string, never>> {}
