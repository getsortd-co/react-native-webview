import React, { Component } from 'react';
import { View, Button, Text, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import WebView, { WebViewSnapshotEvent, SnapshotFormat } from 'react-native-webview';

export default class Snapshot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      webViewHeight: 240, // store the initial height in state
      snapshotData: null,
      snapshotFilePath: null,
      error: null,
      scaling: 0.5,
      quality: 0.5,
      format: 'base64' as SnapshotFormat,
    };
    this.webView = React.createRef();
  }

  snapshot = () => {
    const { scaling, quality, format } = this.state;
    
    // Proper error handling when takeSnapshot is not available
    if (!this.webView.current?.takeSnapshot) {
      this.setState({ 
        error: 'Snapshot feature is not available on this platform.',
        snapshotData: null,
        snapshotFilePath: null
      });
      Alert.alert('Error', 'Snapshot feature is not available on this platform.');
      return;
    }

    // Reset any previous errors
    this.setState({ error: null });

    // Increase the height before taking a snapshot to capture more content.
    this.setState({ webViewHeight: 1200 }, () => {
      // After state has been updated, call takeSnapshot with options.
      setTimeout(async () => {
        try {
          // Pass configurable options to takeSnapshot
          this.webView.current.takeSnapshot({
            scaling,
            quality,
            format,
          });
        } catch (error) {
          this.setState({ 
            error: `Failed to take snapshot: ${error.message}`,
            snapshotData: null,
            snapshotFilePath: null,
            webViewHeight: 240 // Reset height on error
          });
          Alert.alert('Error', `Failed to take snapshot: ${error.message}`);
        }
      }, 300);
    });
  };

  onSnapShotCreated = ({ nativeEvent: event }: { nativeEvent: WebViewSnapshotEvent }) => {
    console.log('onSnapShotCreated', event);
    
    this.setState({ 
      webViewHeight: 240, 
      snapshotData: event.data,
      snapshotFilePath: event.filePath || null 
    });
    
    // Show appropriate notification based on the format
    if (event.filePath) {
      Alert.alert('Success', `Snapshot saved to file: ${event.filePath}`);
    } else if (event.data) {
      Alert.alert('Success', 'Snapshot created successfully as base64 data');
    }
  };

  // Methods to update snapshot configuration
  setScaling = (value) => {
    this.setState({ scaling: parseFloat(value) });
  };

  setQuality = (value) => {
    this.setState({ quality: parseFloat(value) });
  };

  toggleFormat = () => {
    this.setState(prevState => ({ 
      format: prevState.format === 'base64' ? 'file' : 'base64' 
    }));
  };

  render() {
    const { webViewHeight, scaling, quality, format, error, snapshotData, snapshotFilePath } = this.state;
    
    // Only show snapshot options and results if the feature is available on this platform
    const snapshotSupported = Platform.OS === 'ios';
    
    return (
      <ScrollView style={styles.container}>
        <View style={[styles.webViewContainer, { height: webViewHeight }]}>
          <WebView
            ref={this.webView}
            source={{ url: 'https://vehla.com/collections/homepage/products/river-tort-sky?pb=0' }}
            automaticallyAdjustContentInsets={false}
            onSnapshotCreated={this.onSnapShotCreated}
          />
        </View>
        
        <View style={styles.controlsContainer}>
          <Text style={styles.sectionTitle}>Snapshot Configuration</Text>
          
          {!snapshotSupported && (
            <Text style={styles.error}>
              Note: The snapshot feature is currently only available on iOS.
            </Text>
          )}
          
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Scaling Factor: {scaling}</Text>
            <View style={styles.buttonGroup}>
              <Button title="0.25" onPress={() => this.setScaling(0.25)} />
              <Button title="0.5" onPress={() => this.setScaling(0.5)} />
              <Button title="1.0" onPress={() => this.setScaling(1.0)} />
            </View>
          </View>
          
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>JPEG Quality: {quality}</Text>
            <View style={styles.buttonGroup}>
              <Button title="0.3" onPress={() => this.setQuality(0.3)} />
              <Button title="0.5" onPress={() => this.setQuality(0.5)} />
              <Button title="0.8" onPress={() => this.setQuality(0.8)} />
            </View>
          </View>
          
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Format: {format}</Text>
            <Button 
              title={`Switch to ${format === 'base64' ? 'file' : 'base64'}`}
              onPress={this.toggleFormat}
            />
          </View>
          
          <Button title="Take Snapshot" onPress={this.snapshot} />
          
          {error && (
            <Text style={styles.error}>{error}</Text>
          )}
          
          {snapshotFilePath && (
            <View style={styles.resultSection}>
              <Text style={styles.resultTitle}>Snapshot saved to file:</Text>
              <Text style={styles.filePath}>{snapshotFilePath}</Text>
            </View>
          )}
          
          {snapshotData && format === 'base64' && (
            <View style={styles.resultSection}>
              <Text style={styles.resultTitle}>Base64 data (truncated):</Text>
              <Text style={styles.base64Preview}>
                {snapshotData.substring(0, 50)}...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  controlsContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionRow: {
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
  resultSection: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#e8e8e8',
    borderRadius: 4,
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  base64Preview: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  filePath: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: 'blue',
  },
});
