import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/app/context/ThemeContext';

export default function BookmarksScreen() {
  const { isDark } = useTheme();
  
  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Animated.View 
        entering={FadeIn}
        style={[styles.header, isDark && styles.darkHeader]}
      >
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>Bookmarks</Text>
      </Animated.View>

      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80' }}
          style={styles.illustration}
        />
        <Text style={[styles.title, isDark && styles.darkText]}>No bookmarks yet</Text>
        <Text style={[styles.subtitle, isDark && styles.darkSubtitle]}>
          Save your favorite articles to read them later, even when you're offline
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkHeader: {
    backgroundColor: '#111',
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 16,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  darkSubtitle: {
    color: '#aaa',
  },
});