import Node from "./Node";
import { MessageState } from "../Renderer";

export default class TextNode extends Node<string> {
    applyToMessageState(state: MessageState) {
        state.content += this.props;
    }

    get text() {
        return this.props;
    }
}
