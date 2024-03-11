import React from "react";
import ReactDJSElement from "../ReactDJSElement";
import Node from "../Node";
import EmbedChildNode from "./EmbedChildNode";
import { EmbedBuilder } from "discord.js";
import { findType } from "../../helpers";

/** @category Embed */
export interface EmbedAuthorProps {
    name?: React.ReactNode;
    children?: React.ReactNode;
    url?: string;
    iconUrl?: string;
}

/** @category Embed */
export function EmbedAuthor(props: EmbedAuthorProps) {
    return (
        <ReactDJSElement
            props={props}
            createNode={() => new EmbedAuthorNode(props)}
        >
            <ReactDJSElement
                props={{}}
                createNode={() => new AuthorTextNode({})}
            >
                {props.name ?? props.children}
            </ReactDJSElement>
        </ReactDJSElement>
    );
}

class EmbedAuthorNode extends EmbedChildNode<EmbedAuthorProps> {
    override modifyEmbedOptions(options: EmbedBuilder): void {
        options.setAuthor({
            name: findType(this.children, AuthorTextNode)?.text ?? "",
            url: this.props.url,
            iconURL: this.props.iconUrl,
        });
    }
}

class AuthorTextNode extends Node<Record<string, never>> {}
