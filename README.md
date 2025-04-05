## NativeCustomWebView
Native Custom Webview, useful for SSO flow without leaving the native app

## Features
- React to the page loaded
- React to specific callback URL
- Receive the callback URL as parameter in the called nanoflow

## Usage
- Place it on a native page
- Configure the include and (optionally) the exclude callback regexes to capture the callback URL
- Create a nanoflow that receives the context object and the callback URL as string parameter
- Specify the nanoflow as callback action on the widget, make sure to pass the callback URL as parameter to the nanoflow
- Handle the callback in your logic or pass it to MobileSSO
