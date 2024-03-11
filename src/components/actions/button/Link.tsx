import { ButtonSharedProps } from "./shared";
import Node from "../../Node";
import ReactDJSElement from "../../ReactDJSElement";
import { MessageState } from "../../../Renderer";
import { findType, getNextActionRow } from "../../../helpers";
import { ButtonBuilder, ButtonStyle } from "discord.js";

/** @category Link */
export type LinkProps = ButtonSharedProps & {
    /** The URL the link should lead to */
    url: string;
    /** The link text */
    children?: string;
};

/** @category Link */
export function Link({ label, children, ...props }: LinkProps) {
    return (
        <ReactDJSElement props={props} createNode={() => new LinkNode(props)}>
            <ReactDJSElement props={{}} createNode={() => new LinkTextNode({})}>
                {label ?? children}
            </ReactDJSElement>
        </ReactDJSElement>
    );
}

class LinkNode extends Node<Omit<LinkProps, "label" | "children">> {
    override applyToMessageState(state: MessageState) {
        const component = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(this.props.url)
            .setLabel(findType(this.children, LinkTextNode)?.text)
            .setDisabled(this.props.disabled || false);
        if (this.props.emoji) component.setEmoji(this.props.emoji);

        getNextActionRow(state).addComponents(component);
    }
}

class LinkTextNode extends Node<Record<string, never>> {}
