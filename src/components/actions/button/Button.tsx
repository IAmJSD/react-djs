import { randomUUID } from "node:crypto";
import { ButtonSharedProps } from "./shared";
import Node from "../../Node";
import ReactDJSElement from "../../ReactDJSElement";
import {
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ComponentType,
    MessageComponentInteraction,
} from "discord.js";
import { findType, getNextActionRow } from "../../../helpers";
import { MessageState } from "../../../Renderer";

/** @category Button */
export type ButtonProps = ButtonSharedProps & {
    /**
     * The style determines the color of the button and signals intent.
     *
     * @see https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
     */
    style?: ButtonStyle;

    /** Happens when a user clicks the button. */
    onClick: (interaction: ButtonInteraction) => Promise<void> | void;
};

/** @category Button */
export function Button(props: ButtonProps) {
    return (
        <ReactDJSElement props={props} createNode={() => new ButtonNode(props)}>
            <ReactDJSElement
                props={{}}
                createNode={() => new ButtonLabelNode({})}
            >
                {props.label}
            </ReactDJSElement>
        </ReactDJSElement>
    );
}

class ButtonNode extends Node<ButtonProps> {
    private customId = randomUUID();

    // this has text children, but buttons themselves shouldn't yield text
    override get text() {
        return "";
    }

    override applyToMessageState(state: MessageState) {
        const id = this.customId;
        const component = new ButtonBuilder()
            .setCustomId(id)
            .setStyle(this.props.style ?? ButtonStyle.Secondary)
            .setDisabled(this.props.disabled || false)
            .setLabel(findType(this.children, ButtonLabelNode)?.text);
        if (this.props.emoji) component.setEmoji(this.props.emoji);

        getNextActionRow(state).addComponents(component);
    }

    async onMessageInteraction(interaction: MessageComponentInteraction) {
        if (
            interaction.componentType === ComponentType.Button &&
            interaction.customId === this.customId
        ) {
            await this.props.onClick(interaction as ButtonInteraction);
            return true;
        }
        return false;
    }
}

class ButtonLabelNode extends Node<Record<string, never>> {}
