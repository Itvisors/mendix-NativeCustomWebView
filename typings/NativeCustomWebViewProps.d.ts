/**
 * This file was generated from NativeCustomWebView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export interface NativeCustomWebViewProps<Style> {
    name: string;
    style: Style[];
    url: DynamicValue<string>;
    incognito: boolean;
    cacheEnabled: boolean;
    regexInclude?: DynamicValue<string>;
    regexExclude?: DynamicValue<string>;
    regexOnLoadInclude?: DynamicValue<string>;
    callbackUrl: EditableValue<string>;
    onLoad?: ActionValue;
    onError?: ActionValue;
    onCallback?: ActionValue;
}

export interface NativeCustomWebViewPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode?: "design" | "xray" | "structure";
    url: string;
    incognito: boolean;
    cacheEnabled: boolean;
    regexInclude: string;
    regexExclude: string;
    regexOnLoadInclude: string;
    callbackUrl: string;
    onLoad: {} | null;
    onError: {} | null;
    onCallback: {} | null;
}
