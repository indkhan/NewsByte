import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Share2 } from 'lucide-react-native';

export default function ArticleScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();

  const handleShare = () => {
    // Implement share functionality
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Article',
          headerBackTitle: 'Back',
          headerRight: () => (
            <Pressable onPress={handleShare} style={styles.shareButton}>
              <Share2 size={24} color="#007AFF" />
            </Pressable>
          ),
        }} 
      />
      <View style={styles.container}>
        <WebView source={{ uri: url }} style={styles.webview} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  shareButton: {
    padding: 8,
    marginRight: 8,
  },
});