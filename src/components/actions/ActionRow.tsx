import React from "react";
import ReactDJSElement from "../ReactDJSElement";
import Node from "../Node";
import { MessageState } from "../../Renderer";
import { ActionRowBuilder, MessageComponentInteraction } from "discord.js";

/**
 * Props for an action row
 *
 * @category Action Row
 */
export interface ActionRowProps {
    children?: React.ReactNode;
}

/**
 * An action row is a top-level container for message components.
 *
 * You don't need to use this; Reacord automatically creates action rows for
 * you. But this can be useful if you want a specific layout.
 *
 * ```tsx
 * // put buttons on two separate rows
 * <ActionRow>
 *   <Button label="First" onClick={handleFirst} />
 * </ActionRow>
 * <Button label="Second" onClick={handleSecond} />
 * ```
 *
 * @category Action Row
 * @see https://discord.com/developers/docs/interactions/message-components#action-rows
 */
export function ActionRow(props: ActionRowProps) {
    return (
        <ReactDJSElement
            props={props}
            createNode={() => new ActionRowNode(props)}
        >
            {props.children}
        </ReactDJSElement>
    );
}

class ActionRowNode extends Node<ActionRowProps> {
    override applyToMessageState(options: MessageState): void {
        options.components.push(new ActionRowBuilder());
        for (const child of this.children) {
            child.applyToMessageState(options);
        }
    }

    async onMessageInteraction(interaction: MessageComponentInteraction) {
        for (const child of this.children) {
            if (await child.onMessageInteraction(interaction)) {
                return true;
            }
        }
        return false;
    }
}
