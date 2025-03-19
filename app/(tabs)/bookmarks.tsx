import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { useTheme } from '@/app/context/ThemeContext';
import { useUserActions } from '@/app/context/UserActionsContext';
import { Article } from '@/types/news';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function BookmarksScreen() {
  const { isDark } = useTheme();
  const { getBookmarkedArticles, toggleBookmark } = useUserActions();
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks when screen is focused
  useEffect(() => {
    const loadBookmarks = async () => {
      setLoading(true);
      try {
        setBookmarks(getBookmarkedArticles());
      } finally {
        setLoading(false);
      }
    };
    
    loadBookmarks();
  }, [getBookmarkedArticles]);

  // Handle removing a bookmark
  const handleRemoveBookmark = async (article: Article) => {
    await toggleBookmark(article);
    setBookmarks(getBookmarkedArticles());
  };

  // Render a bookmarked article
  const renderBookmarkedArticle = ({ item, index }: { item: Article; index: number }) => {
    const formattedDate = format(new Date(item.publishedAt), 'MMM dd, yyyy');
    
    return (
      <Animated.View 
        entering={SlideInRight.delay(index * 100).springify()}
        style={[styles.articleItem, isDark && styles.darkArticleItem]}
      >
        <Link 
          href={{ pathname: '/article', params: { url: item.url } }}
          style={styles.articleLink}
        >
          <View style={styles.articleContent}>
            <View style={styles.articleHeader}>
              <Text style={[styles.articleSource, isDark && styles.darkAccentText]}>
                {item.source.name}
              </Text>
              <Text style={[styles.articleDate, isDark && styles.darkSubtleText]}>
                {formattedDate}
              </Text>
            </View>
            
            <Text style={[styles.articleTitle, isDark && styles.darkText]} numberOfLines={2}>
              {item.title}
            </Text>
            
            <Text style={[styles.articleDescription, isDark && styles.darkSubtleText]} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.articleActions}>
              <Link href={{ pathname: '/article', params: { url: item.url } }} asChild>
                <Pressable style={[styles.articleButton, styles.readButton]}>
                  <ExternalLink size={14} color="#fff" />
                  <Text style={styles.articleButtonText}>Read</Text>
                </Pressable>
              </Link>

              <Pressable 
                style={[styles.articleButton, styles.removeButton]} 
                onPress={() => handleRemoveBookmark(item)}
              >
                <Trash2 size={14} color="#fff" />
                <Text style={styles.articleButtonText}>Remove</Text>
              </Pressable>
            </View>
          </View>
          
          {item.urlToImage && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item.urlToImage }} 
                style={styles.articleImage}
              />
              {isDark && <View style={styles.imageDarkOverlay} />}
            </View>
          )}
        </Link>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Animated.View 
        entering={FadeIn}
        style={[styles.header, isDark && styles.darkHeader]}
      >
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>Bookmarks</Text>
        <View style={styles.bookmarkIconContainer}>
          <Bookmark size={18} color={isDark ? '#fff' : '#000'} fill={isDark ? '#fff' : '#000'} />
        </View>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#fff' : '#007AFF'} />
        </View>
      ) : bookmarks.length === 0 ? (
        <View style={styles.content}>
          <LinearGradient
            colors={isDark ? ['#333', '#111'] : ['#e0e0e0', '#f8f9fa']}
            style={styles.emptyStateGradient}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80' }}
              style={styles.illustration}
            />
          </LinearGradient>
          <Text style={[styles.title, isDark && styles.darkText]}>No bookmarks yet</Text>
          <Text style={[styles.subtitle, isDark && styles.darkSubtitle]}>
            Save your favorite articles to read them later, even when you're offline
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkedArticle}
          keyExtractor={(item) => item.url}
          contentContainerStyle={styles.bookmarksList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  bookmarkIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateGradient: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  illustration: {
    width: 220,
    height: 220,
    borderRadius: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtitle: {
    color: '#aaa',
  },
  darkAccentText: {
    color: '#60a5fa',
  },
  darkSubtleText: {
    color: '#999',
  },
  bookmarksList: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  articleItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkArticleItem: {
    backgroundColor: '#111',
  },
  articleLink: {
    flexDirection: 'row',
    padding: 16,
    flex: 1,
  },
  articleContent: {
    flex: 1,
    marginRight: 12,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  articleSource: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#007AFF',
  },
  articleDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666',
  },
  articleTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    lineHeight: 22,
  },
  articleDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 90,
    height: 90,
  },
  articleImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  imageDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },
  articleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  articleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  readButton: {
    backgroundColor: '#007AFF',
  },
  removeButton: {
    backgroundColor: '#ff3b30',
  },
  articleButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#fff',
  },
});