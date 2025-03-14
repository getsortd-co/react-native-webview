import React, { Component } from 'react';
import { View, Button } from 'react-native';
import WebView, { WebViewSnapshotEvent } from 'react-native-webview';

export default class Snapshot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      webViewHeight: 240, // store the initial height in state
    };
    this.webView = React.createRef();
  }

  snapshot = () => {
    if (!this.webView.current?.takeSnapshot) {
      throw new Error('takeSnapshot is not defined');
    }

    // Increase the height by 20 before taking a snapshot.
    this.setState({ webViewHeight: 1200 }, () => {
      // After state has been updated, call takeSnapshot.
      setTimeout(async () => {
        this.webView.current.takeSnapshot();
      }, 300);
    });
  };

  onSnapShotCreated = ({ nativeEvent: event }: { nativeEvent: WebViewSnapshotEvent }) => {
    console.log('onSnapShotCreated', event);
    this.setState({ webViewHeight: 240 });
  };

  render() {
    const { webViewHeight } = this.state;
    return (
      <View style={{ height: webViewHeight }}>
        <WebView
          ref={this.webView}
          source={{ url: 'https://vehla.com/collections/homepage/products/river-tort-sky?pb=0' }}
          automaticallyAdjustContentInsets={false}
          onSnapshotCreated={this.onSnapShotCreated}
        />
        <Button title="Snapshot" onPress={this.snapshot} />
      </View>
    );
  }
}
