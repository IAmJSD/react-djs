import ReactDJSElement from "../ReactDJSElement";
import EmbedChildNode from "./EmbedChildNode";
import { EmbedBuilder } from "discord.js";

/** @category Embed */
export interface EmbedThumbnailProps {
    url: string;
}

/** @category Embed */
export function EmbedThumbnail(props: EmbedThumbnailProps) {
    return (
        <ReactDJSElement
            props={props}
            createNode={() => new EmbedThumbnailNode(props)}
        />
    );
}

class EmbedThumbnailNode extends EmbedChildNode<EmbedThumbnailProps> {
    override modifyEmbedOptions(options: EmbedBuilder): void {
        options.setThumbnail(this.props.url);
    }
}
