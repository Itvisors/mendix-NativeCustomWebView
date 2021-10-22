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

interface NativeCustomWebViewState {
    currentUrl: string;
}

export class NativeCustomWebView extends Component<NativeCustomWebViewProps<CustomStyle>, NativeCustomWebViewState> {
    state: NativeCustomWebViewState = {
        currentUrl: ""
    };

    private readonly onLoadHandler = this.onLoad.bind(this);
    private readonly onErrorHandler = this.onError.bind(this);
    private readonly onCallbackHandler = this.onCallback.bind(this);
    private readonly onNavigationStateChangeHandler = this.onNavigationStateChange.bind(this);

    private webview: RNWebView | null = null;
    private shouldRender = true;
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
        const containernode =
            this.shouldRender && uri ? (
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
            ) : (
                <View />
            );
        return containernode;
    }

    componentDidUpdate(prevProps: NativeCustomWebViewProps<CustomStyle>): void {
        if (!prevProps.url) {
            this.setState({
                currentUrl: this.props.url && this.props.url.value ? this.props.url.value : ""
            });
        }
    }

    private onLoad(): void {
        if (this.props.regexOnLoadInclude && this.props.regexOnLoadInclude.value) {
            const url: string = (this.state.currentUrl ? this.state.currentUrl : "") as string;
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

    private onCallback(): void {
        this.executeAction(this.props.onCallback);
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
        this.setState({
            currentUrl: url
        });

        console.info("NativeCustomWebView.onNavigationStateChange URL: " + url);
        let includes = true;
        let excludes = false;
        if (this.props.regexInclude && this.props.regexInclude.value) {
            includes = new RegExp(this.props.regexInclude.value).test(url);
        }
        if (this.props.regexExclude && this.props.regexExclude.value) {
            excludes = new RegExp(this.props.regexExclude.value).test(url);
        }
        // console.info("NativeCustomWebView.onNavigationStateChange includes, excludes: " + includes + ", " + excludes);
        if (includes && !excludes) {
            this.props.callbackUrl.setTextValue(url);
            this.onCallbackHandler();
            if (this.webview) {
                // console.info("loading stopped");
                if (this.webview) {
                    this.webview.stopLoading();
                }
                this.shouldRender = false;
            }
        }
    }

    private executeAction = (action?: ActionValue): void => {
        if (action && action.canExecute && !action.isExecuting) {
            action.execute();
        }
    };
}
