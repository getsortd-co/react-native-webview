import React, { Component, createRef } from 'react';
import { Button, View } from 'react-native';

import WebView from 'react-native-webview';

export default class Snapshot extends Component<Props, State> {
  state = {};

  constructor(props) {
    super(props);

    this.webviewRef = createRef();
  }

  _simulateSnapshot = async () => {
    if (this.webviewRef.current) {
      try {
        const res = await this.webviewRef.current.takeSnapshot();
        console.log('Snapshot result:', res);
      } catch (error) {
        console.error('Error taking snapshot:', error);
      }
    }
  };

  render() {
    return (
      <View style={{ height: 360 }}>
        <WebView source={{ uri: 'https://www.google.com' }} ref={this.webviewRef} />
        <Button title="Take Snapshot" onPress={this._simulateSnapshot} />
      </View>
    );
  }
}
