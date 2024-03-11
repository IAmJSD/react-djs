import React from "react";
import ReactDJSElement from "../ReactDJSElement";
import EmbedChildNode from "./EmbedChildNode";
import { EmbedBuilder } from "discord.js";

/** @category Embed */
export interface EmbedImageProps {
    url: string;
}

/** @category Embed */
export function EmbedImage(props: EmbedImageProps) {
    return (
        <ReactDJSElement
            props={props}
            createNode={() => new EmbedImageNode(props)}
        />
    );
}

class EmbedImageNode extends EmbedChildNode<EmbedImageProps> {
    override modifyEmbedOptions(options: EmbedBuilder): void {
        options.setImage(this.props.url);
    }
}
