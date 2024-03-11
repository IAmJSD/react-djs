import React from "react";
import { MessageState } from "./Renderer";
import ReactReconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import TextNode from "./components/TextNode";
import Node from "./components/Node";
import { MessageComponentInteraction } from "discord.js";

// This is heavily inspired from reacord.
const hostConfig: ReactReconciler.HostConfig<
    string, // Type
    Record<string, unknown>, // Type of props
    ReactWrapper, // Type of container
    Node<unknown>, // Type of instance
    TextNode, // Type of text instance
    never, // Type of suspense instance
    never, // Type of hydration
    never, // Type of public instance
    never, // Type of host context
    true, // Update payload
    never, // Child set
    number, // Timeout handle
    number // No timeout
> = {
    supportsMutation: true,
    supportsPersistence: false,
    supportsHydration: false,
    isPrimaryRenderer: true,
    scheduleTimeout: global.setTimeout,
    cancelTimeout: global.clearTimeout,
    noTimeout: -1,

    getRootHostContext: () => null,
    getChildHostContext: (p) => p,

    createInstance(type, props) {
        if (type !== "react-djs-element")
            throw new Error(`Invalid element type: ${type}`);
        if (typeof props.createNode !== "function")
            throw new Error("Invalid props.createNode");

        const node: unknown = props.createNode(props);
        if (!(node instanceof Node)) throw new Error("Invalid node");

        return node;
    },
    createTextInstance: (text) => new TextNode(text),
    shouldSetTextContent: () => false,
    detachDeletedInstance: () => {},
    beforeActiveInstanceBlur: () => {},
    afterActiveInstanceBlur: () => {},
    getInstanceFromNode: () => null,
    getInstanceFromScope: () => null,

    clearContainer: (r) => {
        // @ts-ignore: This is a private property.
        r.nodes = [];
    },
    appendChildToContainer: (r, node) => {
        // @ts-ignore: This is a private property.
        r.nodes.push(node);
    },
    removeChildFromContainer: (r, node) => {
        // @ts-ignore: This is a private property.
        r.nodes = r.nodes.filter((n) => n !== node);
    },
    insertInContainerBefore: (r, node, before) => {
        // @ts-ignore: This is a private property.
        const index = r.nodes.indexOf(before);
        if (index === -1) throw new Error("Invalid child");
        // @ts-ignore: This is a private property.
        r.nodes.splice(index, 0, node);
    },

    appendInitialChild: (parent, child) => {
        parent.children.push(child);
    },
    appendChild: (parent, child) => {
        parent.children.push(child);
    },
    removeChild: (parent, child) => {
        parent.children = parent.children.filter((c) => c !== child);
    },
    insertBefore: (parent, child, before) => {
        const index = parent.children.indexOf(before);
        if (index === -1) throw new Error("Invalid child");
        parent.children.splice(index, 0, child);
    },

    prepareUpdate: () => true,
    commitUpdate: (node, _, __, ___, newProps) => {
        node.props = newProps.props;
    },
    commitTextUpdate: (node, _, text) => {
        node.props = text;
    },

    prepareForCommit: () => null,
    resetAfterCommit: (r) => {
        // @ts-ignore: This is a private property.
        r.reactCommit();
    },
    prepareScopeUpdate: () => {},

    preparePortalMount: () => {
        throw new Error("Not implemented");
    },
    getPublicInstance: () => {
        throw new Error("Not implemented");
    },

    finalizeInitialChildren: () => false,
    getCurrentEventPriority: () => DefaultEventPriority,
};

const ReconcilerInstance = ReactReconciler(hostConfig);

// Wraps React behaviours and returns a Discord message.
export default class ReactWrapper {
    // @ts-ignore: Set by the reconciler.
    public result: MessageState;
    private nodes: Node<unknown>[] = [];
    private container: ReturnType<typeof ReconcilerInstance.createContainer>;
    private active = true;

    constructor(
        private onUpdate: (msg: MessageState) => void,
        private node: React.ReactNode,
    ) {
        // Create the root container.
        this.container = ReconcilerInstance.createContainer(
            this,
            0,
            null,
            false,
            null,
            "react-djs",
            () => {},
            null,
        );

        // Render the node.
        ReconcilerInstance.updateContainer(this.node, this.container);
    }

    private reactCommit() {
        // Build the component.
        const state: MessageState = { content: "", embeds: [], components: [] };
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].applyToMessageState(state);
        }

        // Update the message.
        this.result = state;

        // Make sure this is active.
        if (!this.active) return;

        // Call the update callback.
        this.onUpdate(state);
    }

    async waitForUpdate() {
        return new Promise<void>((res) => {
            ReconcilerInstance.updateContainer(
                this.node,
                this.container,
                null,
                res,
            );
        });
    }

    async dispatchEvent(interaction: MessageComponentInteraction) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (await this.nodes[i].onMessageInteraction(interaction))
                return true;
        }
        return false;
    }

    kill() {
        ReconcilerInstance.updateContainer(null, this.container);
        this.active = false;
    }
}
