import React, { Component } from 'react';
import { Text, View, TouchableOpacity, PanResponder, Platform, Button } from 'react-native';

// import WebView, {WebViewSnapshotEvent} from 'react-native-webview';
import WebView, { WebViewSnapshotEvent } from '../../src/WebView';

type Props = {};
type State = {};

export default class Snapshot extends Component<Props, State> {
  state = {};

  constructor(props) {
    super(props);
    this.webView = React.createRef();
    this.state = {
      text: 'Not Started',
    };
  }

  snapshot = () => {
    this.webView.current.takeSnapshot('foo11.png');
  };

  onSnapShotCreated = ({ nativeEvent: event }: { nativeEvent: WebViewSnapshotEvent }) => {
    console.log('onSnapShotCreated', event);
  };

  render() {
    return (
      <View style={{ height: 240 }}>
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
