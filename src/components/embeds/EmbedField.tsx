import ReactDJSElement from "../ReactDJSElement";
import Node from "../Node";
import React from "react";
import EmbedChildNode from "./EmbedChildNode";
import { EmbedBuilder } from "discord.js";
import { findType } from "../../helpers";

/** @category Embed */
export interface EmbedFieldProps {
    name: React.ReactNode;
    value?: React.ReactNode;
    inline?: boolean;
    children?: React.ReactNode;
}

/** @category Embed */
export function EmbedField(props: EmbedFieldProps) {
    return (
        <ReactDJSElement
            props={props}
            createNode={() => new EmbedFieldNode(props)}
        >
            <ReactDJSElement
                props={{}}
                createNode={() => new FieldNameNode({})}
            >
                {props.name}
            </ReactDJSElement>
            <ReactDJSElement
                props={{}}
                createNode={() => new FieldValueNode({})}
            >
                {props.value ?? props.children}
            </ReactDJSElement>
        </ReactDJSElement>
    );
}

class EmbedFieldNode extends EmbedChildNode<EmbedFieldProps> {
    modifyEmbedOptions(options: EmbedBuilder): void {
        options.addFields({
            name: findType(this.children, FieldNameNode)?.text ?? "",
            value: findType(this.children, FieldValueNode)?.text ?? "",
            inline: this.props.inline,
        });
    }
}

class FieldNameNode extends Node<Record<string, never>> {}
class FieldValueNode extends Node<Record<string, never>> {}
