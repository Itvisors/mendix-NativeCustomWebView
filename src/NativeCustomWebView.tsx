import { Component, ReactNode, createElement } from "react";
import { TextStyle, ViewStyle } from "react-native";

import { Style } from "@mendix/pluggable-widgets-tools";

import { HelloWorld } from "./components/HelloWorld";
import { NativeCustomWebViewProps } from "../typings/NativeCustomWebViewProps";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

export class NativeCustomWebView extends Component<NativeCustomWebViewProps<CustomStyle>> {
    render(): ReactNode {
        return <HelloWorld name={this.props.yourName} style={this.props.style} />;
    }
}
