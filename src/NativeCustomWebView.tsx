import { Component, ReactNode, createElement } from "react";
import { View, TextStyle, ViewStyle } from "react-native";
import { WebView as RNWebView, WebViewNavigation } from "react-native-webview";
import { ActionValue } from "mendix";

import { mergeNativeStyles, Style } from "@mendix/pluggable-widgets-tools";

import { NativeCustomWebViewProps } from "../typings/NativeCustomWebViewProps";

export interface CustomStyle extends Style {
    container: ViewStyle;
}

interface WebViewStyle extends Style {
    container: ViewStyle;
    errorContainer: ViewStyle;
    errorText: TextStyle;
}

export class NativeCustomWebView extends Component<NativeCustomWebViewProps<CustomStyle>> {
    private currentUrl = "";

    private readonly onLoadHandler = this.onLoad.bind(this);
    private readonly onErrorHandler = this.onError.bind(this);
    private readonly onNavigationStateChangeHandler = this.onNavigationStateChange.bind(this);

    private webview: RNWebView | null = null;
    private defaultWebViewStyle: WebViewStyle = {
        container: {
            flex: 1,
            height: "100%",
            minHeight: 300
        },
        errorContainer: {},
        errorText: {
            color: "red",
            fontWeight: "bold"
        }
    };

    render(): ReactNode {
        const uri = this.props.url.value;
        const styles = mergeNativeStyles(this.defaultWebViewStyle, this.props.style);
        return (
            <View style={styles.container}>
                <RNWebView
                    ref={ref => (this.webview = ref)}
                    testID={this.props.name}
                    source={{ uri: uri! }}
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                    incognito={this.props.incognito}
                    cacheEnabled={this.props.cacheEnabled}
                    onLoadEnd={this.onLoadHandler}
                    onError={this.onErrorHandler}
                    onNavigationStateChange={this.onNavigationStateChangeHandler}
                    sharedCookiesEnabled /* voor iOS */
                />
            </View>
        );
    }

    componentDidUpdate(prevProps: NativeCustomWebViewProps<CustomStyle>): void {
        if (!this.props.url?.value) {
            console.info("NativeCustomWebView.componentDidUpdate: No URL value");
            return;
        }
        if (!prevProps.url || prevProps.url.value !== this.props.url.value) {
            console.info("NativeCustomWebView.componentDidUpdate: New or different URL value: " + this.props.url.value);
            this.currentUrl = this.props.url.value;
        }
    }

    private onLoad(): void {
        if (this.props.regexOnLoadInclude && this.props.regexOnLoadInclude.value) {
            const url: string = (this.currentUrl ? this.currentUrl : "") as string;
            if (new RegExp(this.props.regexOnLoadInclude.value).test(url)) {
                this.executeAction(this.props.onLoad);
            }
        } else {
            this.executeAction(this.props.onLoad);
        }
    }

    private onError(): void {
        this.executeAction(this.props.onError);
    }

    private onNavigationStateChange(newNavState: WebViewNavigation): void {
        // newNavState looks something like this:
        // {
        //   url?: string;
        //   title?: string;
        //   loading?: boolean;
        //   canGoBack?: boolean;
        //   canGoForward?: boolean;
        // }

        const { url } = newNavState;
        this.currentUrl = url;

        console.info(
            "NativeCustomWebView.onNavigationStateChange URL: " +
                url +
                ", loading: " +
                newNavState.loading +
                ", navigation type: " +
                newNavState.navigationType
        );
        for (const callbackDefinition of this.props.callbackList) {
            let includes = true;
            let excludes = false;
            if (callbackDefinition.regexInclude?.value) {
                includes = new RegExp(callbackDefinition.regexInclude.value).test(url.toLowerCase());
            }
            if (callbackDefinition.regexExclude?.value) {
                excludes = new RegExp(callbackDefinition.regexExclude.value).test(url.toLowerCase());
            }
            if (includes && !excludes) {
                console.info(
                    "NativeCustomWebView.onNavigationStateChange match include: " +
                        callbackDefinition.regexInclude?.value +
                        ", exclude: " +
                        callbackDefinition.regexExclude?.value
                );
                if (callbackDefinition.stopLoading && this.webview) {
                    console.info("NativeCustomWebView.onNavigationStateChange: Stop loading");
                    this.webview.stopLoading();
                }
                callbackDefinition.callbackUrl.setTextValue(url);
                this.executeAction(callbackDefinition.onCallback);

                // Match only the first definition found to prevent multiple callbacks at the same time.
                break;
            }
        }
    }

    private executeAction = (action?: ActionValue): void => {
        if (action && action.canExecute && !action.isExecuting) {
            action.execute();
        }
    };
}
