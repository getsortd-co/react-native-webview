import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import WebView, { WebViewSnapshotEvent, WebViewSnapshotErrorEvent } from 'react-native-webview';
import Slider from '@react-native-community/slider';

interface SnapshotProps {}

interface SnapshotState {
  webViewHeight: number;
  dataUrl: string;
  loading: boolean;
  error: string | null;
  scale: number;
  quality: number;
  webViewReady: boolean;
}

export default class Snapshot extends Component<SnapshotProps, SnapshotState> {
  constructor(props: SnapshotProps) {
    super(props);
    this.state = {
      webViewHeight: 320,
      dataUrl: '',
      loading: false,
      error: null,
      scale: 0.5,
      quality: 0.5,
      webViewReady: false,
    };

    this.webView = React.createRef<WebView>();
  }

  onLoadEnd = () => {
    this.setState({ webViewReady: true });
  };

  onSnapshotCreated = (event: WebViewSnapshotEvent | WebViewSnapshotErrorEvent) => {
    this.setState({ loading: false, webViewHeight: 320 });
    console.log("NATIVE EVENT", event.nativeEvent)

    if ('error' in event.nativeEvent) {
      // Handle error case
      const errorMessage = event.nativeEvent.error || 'Failed to create snapshot';
      this.setState({ error: errorMessage });
      console.error('Snapshot error:', errorMessage);
      return;
    }

    if (event.nativeEvent.success) {
      // Handle success case
      this.setState({
        dataUrl: event.nativeEvent?.base64,
        error: null,
      });
    } else {
      // Handle unknown failure case
      this.setState({
        error: 'Unknown error occurred while creating snapshot',
      });
    }
  };

  takeSnapshot = () => {
    const { webViewReady } = this.state;
    if (!webViewReady) {
      this.setState({
        error: 'WebView is not ready yet',
        loading: false,
      });
      return;
    }

    if (!this.webView.current?.takeSnapshot) {
      this.setState({ 
        error: 'Snapshot feature is not available on your device',
        loading: false,
      });
      return;
    }

    this.setState({ loading: true, error: null, webViewHeight: 1200 }, () => {
      setTimeout(() => {
        try {
          const snapshotOptions = {
            scale: this.state.scale,
            quality: this.state.quality,
          };
          console.log('snapshotOptions at capture time', snapshotOptions);
          this.webView.current.takeSnapshot(snapshotOptions);
        } catch (error) {
          this.setState({
            error: `Failed to take snapshot: ${error instanceof Error ? error.message : 'Unknown error'}`,
            loading: false,
          });
        }
      }, 300);
    });
  };

  handleScaleChange = (value: number) => {
    this.setState({ scale: parseFloat(value.toFixed(2)) });
  };

  handleQualityChange = (value: number) => {
    this.setState({ quality: parseFloat(value.toFixed(2)) });
  };

  render() {
    const { webViewHeight, dataUrl, loading, error, scale, quality, webViewReady } = this.state;

    return (
      <ScrollView style={styles.container}>
        <View style={[styles.webViewContainer, { height: webViewHeight }]}>
          <WebView
            ref={this.webView}
            source={{ url: 'https://vehla.com/collections/homepage/products/river-tort-sky?pb=0' }}
            onLoadEnd={this.onLoadEnd}
            // @ts-ignore - The onSnapshotCreated prop exists on iOS WebView
            onSnapshotCreated={this.onSnapshotCreated}
            automaticallyAdjustContentInsets={false}
          />
        </View>

        <View style={styles.controlsContainer}>
          <Text style={styles.sectionTitle}>Configuration</Text>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Scale: {scale * 100}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={1.0}
              step={0.05}
              value={scale}
              onValueChange={this.handleScaleChange}
              disabled={loading}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#CCCCCC"
              thumbTintColor="#007AFF"
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Quality: {quality * 100}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={1.0}
              step={0.05}
              value={quality}
              onValueChange={this.handleQualityChange}
              disabled={loading}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#CCCCCC"
              thumbTintColor="#007AFF"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (!webViewReady || loading) && styles.buttonDisabled,
            ]}
            onPress={this.takeSnapshot}
            disabled={!webViewReady || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Snapshot...' : 'Take Snapshot'}
            </Text>
          </TouchableOpacity>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Creating snapshot...</Text>
            </View>
          )}

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        {dataUrl ? (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionTitle}>Snapshot Result</Text>
            <Text style={styles.resultInfo}>
              Snapshot taken with scale: {scale * 100}% and quality: {quality * 100}%
            </Text>
            <Image
              source={{ uri: dataUrl }}
              style={styles.snapshotImage}
              resizeMode="contain"
            />
          </View>
        ) : null}

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Note: This feature is only available on iOS 11.0 and above.
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    flexDirection: 'column',
  },
  webViewContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  controlsContainer: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    display: 'none',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  slider: {
    height: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#A0C0E0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFEEEE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CC0000',
    marginBottom: 4,
  },
  errorText: {
    color: '#CC0000',
    fontSize: 13,
  },
  resultContainer: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  snapshotImage: {
    width: '100%',
    height: 300,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  noteContainer: {
    margin: 10,
    padding: 12,
    backgroundColor: '#FFFDE7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFF9C4',
    marginBottom: 24,
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
});
