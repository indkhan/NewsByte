import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Article } from '@/types/news';
import { truncateText } from '@/utils/textUtils';
import { Link } from 'expo-router';
import { Share2, Heart, MessageCircle, Bookmark } from 'lucide-react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useTheme } from '@/app/context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface NewsCardProps {
  article: Article;
  index: number;
}

export function NewsCard({ article, index }: NewsCardProps) {
  const { isDark } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 1000));
  const [comments, setComments] = useState(Math.floor(Math.random() * 100));
  const formattedDate = format(new Date(article.publishedAt), 'MMM dd, yyyy');
  const summary = truncateText(article.content || article.description, 60);
  
  const handleShare = () => {
    // Implement share functionality
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    // Implement bookmark functionality
  };

  return (
    <Animated.View 
      entering={FadeInRight.delay(index * 100)}
      exiting={FadeOutLeft}
      style={[styles.container, { height: height - 60 }]}
    >
      <Image
        source={{ 
          uri: article.urlToImage || 
          'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80' 
        }}
        style={styles.backgroundImage}
      />
      <View style={[styles.overlay, isDark && styles.darkOverlay]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.source, isDark && styles.darkText]}>{article.source.name}</Text>
          <Text style={[styles.date, isDark && styles.darkText]}>{formattedDate}</Text>
        </View>
        
        <Text style={[styles.title, isDark && styles.darkText]} numberOfLines={3}>
          {article.title}
        </Text>
        
        <Text style={[styles.summary, isDark && styles.darkText]}>
          {summary}
        </Text>
      </View>

      <View style={styles.sideActions}>
        <Pressable onPress={handleLike} style={styles.actionButton}>
          <Heart 
            size={32} 
            color={liked ? '#ff2d55' : (isDark ? '#fff' : '#000')}
            fill={liked ? '#ff2d55' : 'transparent'}
          />
          <Text style={[styles.actionText, isDark && styles.darkText]}>{likes}</Text>
        </Pressable>

        <Link href={{ pathname: '/comments', params: { id: index.toString() } }} asChild>
          <Pressable style={styles.actionButton}>
            <MessageCircle size={32} color={isDark ? '#fff' : '#000'} />
            <Text style={[styles.actionText, isDark && styles.darkText]}>{comments}</Text>
          </Pressable>
        </Link>

        <Pressable onPress={handleShare} style={styles.actionButton}>
          <Share2 size={32} color={isDark ? '#fff' : '#000'} />
        </Pressable>

        <Pressable onPress={handleBookmark} style={styles.actionButton}>
          <Bookmark size={32} color={isDark ? '#fff' : '#000'} />
        </Pressable>
      </View>

      <Link 
        href={{ pathname: '/article', params: { url: article.url } }} 
        style={styles.fullScreenButton}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  darkOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  source: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#007AFF',
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#000',
    marginBottom: 12,
    lineHeight: 32,
  },
  summary: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  darkText: {
    color: '#fff',
  },
  sideActions: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  fullScreenButton: {
    ...StyleSheet.absoluteFillObject,
  },
});