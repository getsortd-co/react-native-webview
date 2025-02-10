import React, { Component, createRef } from 'react';
import { Button, View } from 'react-native';

// import WebView from 'react-native-webview';
import WebView from '../../src/WebView';

export default class Snapshot extends Component {
  webviewRef = createRef();

  _simulateSnapshot = async () => {
    console.log("webviewref", Object.keys(this.webviewRef.current))
    // console.log("the webview =>", Object.keys(this.webviewRef.current.getWebView()._nativeTag)

    if (this.webviewRef.current) {
      try {
        const base64Snapshot = await this.webviewRef.current?.takeSnapshot();
        console.log('Snapshot result (base64): \n\n', base64Snapshot);
      } catch (error) {
        console.error('Error taking snapshot:', error);
      }
    }
  };


  _simulateSnapshotB = async () => {
    const webView = this.webviewRef.current.getWebView();
    console.log("webView:", webView)


    const nativeTag = this.webviewRef.current._nativeTag;
    console.log("nativeTag:", nativeTag)


    const webViewNativeTag = this.webviewRef.current.getWebView()._nativeTag;
    console.log("webViewNativeTag:", webViewNativeTag)
  };

  _simulateSnapshotC = async () => {
    console.log("Taking snapshot c\n\n");

    const webView = this.webviewRef.current.getWebView();
    console.log("snapshot example |> this.webviewRef.current.getWebView():", webView)

    const nativeTag = this.webviewRef.current._nativeTag;
    console.log("snapshot example |> this.webviewRef.current._nativeTag:", nativeTag)

    const webViewNativeTag = this.webviewRef.current.getWebView()._nativeTag;
    console.log("snapshot example |> this.webviewRef.current.getWebView()._nativeTag:", webViewNativeTag)

    console.log("snapshot example |> beginning snapshot:\n\n")

    try {
      const base64Snapshot = await this.webviewRef.current.takeSnapshot();
      console.log('Snapshot result (base64): \n\n', base64Snapshot);
    } catch (error) {
      console.error('Error taking snapshot:', error);

    }
  };


  render() {
    return (
      <View>
        <View style={{ height: 240 }}>
          <WebView
            ref={this.webviewRef}
            source={{ url: 'https://www.google.com' }}
          />
        </View>
        <Button title="Take Snapshot" onPress={this._simulateSnapshot} />
        <Button title="Take SnapshotB" onPress={this._simulateSnapshotB} />
        <Button title="Take SnapshotC" onPress={this._simulateSnapshotC} />
      </View>
    );
  }
}
