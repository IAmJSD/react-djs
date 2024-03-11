import React from "react";
import Node from "./Node";

export default function ReactDJSElement<Props>(props: {
    props: Props;
    createNode: () => Node<Props>;
    children?: React.ReactNode;
}) {
    return React.createElement("react-djs-element", props);
}
