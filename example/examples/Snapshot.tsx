import React, { Component } from 'react';
import { View, Button } from 'react-native';
import WebView, { WebViewSnapshotEvent } from '../../src/WebView';

// TODO: move this event elsewhere

// import WebView from 'react-native-webview';

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
        console.log('In timeout');
        const res = await this.webView.current.takeSnapshot('foo11.png');
        console.log('res', res);
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
          source={{ url: 'https://www.google.com' }}
          automaticallyAdjustContentInsets={false}
          onSnapshotCreated={this.onSnapShotCreated}
        />
        <Button title="Snapshot" onPress={this.snapshot} />
      </View>
    );
  }
}
