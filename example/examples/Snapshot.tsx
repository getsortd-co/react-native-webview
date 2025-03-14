import React, { Component } from 'react';
import { View, Button, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import WebView, { WebViewSnapshotEvent, WebViewSnapshotErrorEvent } from 'react-native-webview';

interface SnapshotProps {}

interface SnapshotState {
  webViewHeight: number;
  snapshotUri: string | null;
  isLoading: boolean;
  error: string | null;
}

export default class Snapshot extends Component<SnapshotProps, SnapshotState> {
  constructor(props: SnapshotProps) {
    super(props);
    this.state = {
      webViewHeight: 240, // store the initial height in state
      snapshotUri: null,
      isLoading: false,
      error: null,
    };
    this.webView = React.createRef<WebView>();
  }

  snapshot = () => {
    if (!this.webView.current?.takeSnapshot) {
      this.setState({ 
        error: 'Snapshot feature is not available on your device',
        isLoading: false
      });
      return;
    }

    // Reset error state and set loading to true
    this.setState({ 
      error: null, 
      isLoading: true,
      snapshotUri: null
    }, () => {
      // Increase the height for capturing more content
      this.setState({ webViewHeight: 1200 }, () => {
        // After state has been updated, call takeSnapshot.
        setTimeout(() => {
          try {
            this.webView.current?.takeSnapshot();
          } catch (error) {
            this.setState({
              error: `Failed to take snapshot: ${error instanceof Error ? error.message : 'Unknown error'}`,
              isLoading: false,
              webViewHeight: 240
            });
          }
        }, 300);
      });
    });
  };

  onSnapShotCreated = ({ nativeEvent }: { nativeEvent: WebViewSnapshotEvent | WebViewSnapshotErrorEvent }) => {
    console.log('onSnapShotCreated', nativeEvent);
    
    // Check if this is an error event
    if ('error' in nativeEvent) {
      this.setState({
        webViewHeight: 240,
        isLoading: false,
        error: `Snapshot error: ${nativeEvent.error}`,
        snapshotUri: null
      });
      return;
    }
    
    // Handle success case
    if ('uri' in nativeEvent) {
      this.setState({
        webViewHeight: 240,
        isLoading: false,
        error: null,
        snapshotUri: nativeEvent.uri
      });
    } else {
      // Handle case where URI is missing but no error was returned
      this.setState({
        webViewHeight: 240,
        isLoading: false,
        error: 'Snapshot completed but no image was returned',
        snapshotUri: null
      });
    }
  };

  render() {
    const { webViewHeight, isLoading, error, snapshotUri } = this.state;
    return (
      <View style={styles.container}>
        <View style={[styles.webViewContainer, { height: webViewHeight }]}>
          <WebView
            ref={this.webView}
            source={{ url: 'https://vehla.com/collections/homepage/products/river-tort-sky?pb=0' }}
            automaticallyAdjustContentInsets={false}
            onSnapshotCreated={this.onSnapShotCreated}
          />
        </View>
        
        <View style={styles.controlsContainer}>
          <Button 
            title={isLoading ? "Taking snapshot..." : "Take Snapshot"} 
            onPress={this.snapshot}
            disabled={isLoading} 
          />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>Creating snapshot...</Text>
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {snapshotUri && !error && (
            <View style={styles.resultContainer}>
              <Text style={styles.successText}>Snapshot created successfully!</Text>
              <Image 
                source={{ uri: snapshotUri }} 
                style={styles.thumbnailImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  webViewContainer: {
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  controlsContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0000ff',
  },
  errorContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#388e3c',
    marginBottom: 10,
  },
  thumbnailImage: {
    width: 300,
    height: 200,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: '#eeeeee',
  },
});
