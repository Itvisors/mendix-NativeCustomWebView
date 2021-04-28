/**
 * This file was generated from NativeCustomWebView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export interface NativeCustomWebViewProps<Style> {
    name: string;
    style: Style[];
    url: DynamicValue<string>;
    regexInclude?: DynamicValue<string>;
    regexExclude?: DynamicValue<string>;
    regexOnLoadInclude?: DynamicValue<string>;
    callback: EditableValue<string>;
    onLoad?: ActionValue;
    onError?: ActionValue;
    onCallback?: ActionValue;
}

export interface NativeCustomWebViewPreviewProps {
    class: string;
    style: string;
    url: string;
    regexInclude: string;
    regexExclude: string;
    regexOnLoadInclude: string;
    callback: string;
    onLoad: {} | null;
    onError: {} | null;
    onCallback: {} | null;
}
