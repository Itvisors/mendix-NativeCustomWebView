/**
 * This file was generated from NativeCustomWebView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export interface CallbackListType {
    regexInclude?: DynamicValue<string>;
    regexExclude?: DynamicValue<string>;
    stopLoading: boolean;
    callbackUrl: EditableValue<string>;
    onCallback?: ActionValue;
}

export interface CallbackListPreviewType {
    regexInclude: string;
    regexExclude: string;
    stopLoading: boolean;
    callbackUrl: string;
    onCallback: {} | null;
}

export interface NativeCustomWebViewProps<Style> {
    name: string;
    style: Style[];
    url: DynamicValue<string>;
    incognito: boolean;
    cacheEnabled: boolean;
    regexOnLoadInclude?: DynamicValue<string>;
    callbackList: CallbackListType[];
    onLoad?: ActionValue;
    onError?: ActionValue;
}

export interface NativeCustomWebViewPreviewProps {
    class: string;
    style: string;
    url: string;
    incognito: boolean;
    cacheEnabled: boolean;
    regexOnLoadInclude: string;
    callbackList: CallbackListPreviewType[];
    onLoad: {} | null;
    onError: {} | null;
}
