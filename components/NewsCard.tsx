import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Pressable, Share as ReactNativeShare, Alert, TouchableOpacity, Platform, TextInput } from 'react-native';
import { format } from 'date-fns';
import { Article } from '@/types/news';
import { truncateText } from '@/utils/textUtils';
import { Link, useRouter } from 'expo-router';
import { Share2, Heart, MessageCircle, Bookmark, ExternalLink, Clock } from 'lucide-react-native';
import Animated, { FadeInRight, FadeOutLeft, useAnimatedStyle, withTiming, withSequence, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/app/context/ThemeContext';
import { useUserActions } from '@/app/context/UserActionsContext';
import { useAuth } from '@/app/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height - 120; // Adjusted for bottom navigation buttons

interface NewsCardProps {
  article: Article;
  index: number;
}

// Create animated components
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function NewsCard({ article, index }: NewsCardProps) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  // Get user actions from context
  const { 
    toggleLike, 
    toggleBookmark, 
    isLiked, 
    isBookmarked,
    getArticleComments,
    addComment
  } = useUserActions();

  // Local state for UI
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 1000));
  const [comments, setComments] = useState(0);
  
  // Animated values
  const heartScale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);
  const contentOpacity = useSharedValue(1);

  // New state for comment input
  const [commentInputVisible, setCommentInputVisible] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Format article info
  const formattedDate = format(new Date(article.publishedAt), 'MMM dd, yyyy');
  const summary = truncateText(article.content || article.description, 120); // Show more content

  // Load initial state
  useEffect(() => {
    if (article.url) {
      // Set liked state
      const articleLiked = isLiked(article.url);
      setLiked(articleLiked);
      
      // Set bookmarked state
      const articleBookmarked = isBookmarked(article.url);
      setBookmarked(articleBookmarked);
      
      // Set comments count
      const articleComments = getArticleComments(index.toString());
      setComments(articleComments.length);
    }
  }, [article.url, isLiked, isBookmarked, getArticleComments, index]);

  // Navigate to article
  const handleOpenArticle = () => {
    router.push({
      pathname: '/article',
      params: { url: article.url }
    } as any);
  };

  // Share functionality
  const handleShare = async (e: any) => {
    e.stopPropagation();
    
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to share articles', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/login' as any) }
      ]);
      return;
    }
    
    try {
      const result = await ReactNativeShare.share({
        message: `Check out this article: ${article.title}`,
        url: article.url,
        title: 'Share Article',
      });

      if (result.action === ReactNativeShare.sharedAction) {
        console.log('Shared successfully');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Could not share the article');
    }
  };

  // Like functionality
  const handleLike = async (e: any) => {
    e.stopPropagation();
    
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to like articles', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/login' as any) }
      ]);
      return;
    }

    // Animate heart
    heartScale.value = withSequence(
      withSpring(1.5, { damping: 2 }),
      withSpring(1)
    );

    // Optimistic UI update
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
    
    // Update backend
    const success = await toggleLike(article.url);
    
    if (!success) {
      // Revert UI if operation failed
      setLiked(liked);
      setLikes(prev => !liked ? prev - 1 : prev + 1);
      Alert.alert('Error', 'Could not update like status');
    }
  };

  // Comment functionality
  const handleComment = (e: any) => {
    e.stopPropagation();
    
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to comment on articles', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/login' as any) }
      ]);
      return;
    }
    
    router.push({
      pathname: '/comments',
      params: { id: index.toString() }
    } as any);
  };

  // Bookmark functionality
  const handleBookmark = async (e: any) => {
    e.stopPropagation();
    
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to bookmark articles', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/login' as any) }
      ]);
      return;
    }

    // Animate bookmark
    bookmarkScale.value = withSequence(
      withSpring(1.5, { damping: 2 }),
      withSpring(1)
    );

    // Optimistic UI update
    setBookmarked(!bookmarked);
    
    // Update backend
    const success = await toggleBookmark(article);
    
    if (!success) {
      // Revert UI if operation failed
      setBookmarked(bookmarked);
      Alert.alert('Error', 'Could not update bookmark status');
    }
  };

  // Animated styles
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }]
  }));

  const bookmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }]
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value
  }));

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      await addComment(article.url, newComment);
      setNewComment('');
      setCommentInputVisible(false);
    }
  };

  return (
    <View style={[styles.container, { height: CARD_HEIGHT }]}>
      {/* Background Image with Gradient Overlay */}
      <Image
        source={{ 
          uri: article.urlToImage || 
          'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80' 
        }}
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={isDark 
          ? ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.9)'] 
          : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.95)']}
        style={styles.gradientOverlay}
      />
      
      {/* Article Content */}
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        {/* Source and Date */}
        <View style={styles.sourceContainer}>
          <View style={styles.sourceWrapper}>
            <Text style={[styles.source, isDark && styles.darkAccentText]}>
              {article.source.name}
            </Text>
          </View>
          
          <View style={styles.dateWrapper}>
            <Clock size={12} color={isDark ? '#aaa' : '#666'} />
            <Text style={[styles.date, isDark && styles.darkSubtleText]}>
              {formattedDate}
            </Text>
          </View>
        </View>
        
        {/* Title */}
        <Text style={[styles.title, isDark && styles.darkText]}>
          {article.title}
        </Text>
        
        {/* Summary */}
        <Text style={[styles.summary, isDark && styles.darkSubtleText]}>
          {summary}
        </Text>

        {/* Read Article Button */}
        <TouchableOpacity 
          style={[styles.readButton, isDark && styles.darkReadButton]}
          onPress={handleOpenArticle}
          activeOpacity={0.8}
        >
          <ExternalLink size={16} color="#fff" />
          <Text style={styles.readButtonText}>
            Read Article
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Action Buttons - Vertical Layout */}
      <View style={styles.actionsContainer}>
        <Pressable onPress={handleLike} style={styles.actionButton}>
          <Heart size={36} color={liked ? '#ff2d55' : (isDark ? '#fff' : '#333')} />
          <Text style={styles.likeCount}>{likes}</Text>
        </Pressable>
        <Pressable onPress={handleComment} style={styles.actionButton}>
          <MessageCircle size={36} color={isDark ? '#fff' : '#333'} />
        </Pressable>
        <Pressable onPress={handleShare} style={styles.actionButton}>
          <Share2 size={36} color={isDark ? '#fff' : '#333'} />
        </Pressable>
        <Pressable onPress={handleBookmark} style={styles.actionButton}>
          <Bookmark size={36} color={bookmarked ? '#007AFF' : (isDark ? '#fff' : '#333')} />
        </Pressable>
      </View>

      {/* Comment Input Field */}
      {commentInputVisible && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor={isDark ? '#aaa' : '#999'}
            value={newComment}
            onChangeText={setNewComment}
            onSubmitEditing={handleCommentSubmit}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    padding: 24,
  },
  sourceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sourceWrapper: {
    backgroundColor: 'rgba(0,123,255,0.15)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  source: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#007AFF',
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30,
    color: '#000',
    marginBottom: 16,
    lineHeight: 40,
  },
  summary: {
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    color: '#555',
    lineHeight: 26,
    marginBottom: 24,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  darkReadButton: {
    backgroundColor: '#0A84FF',
  },
  readButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  actionsContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionButton: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#fff',
    marginLeft: 4,
  },
  commentInputContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  commentInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  darkText: {
    color: '#fff',
  },
  darkSubtleText: {
    color: '#aaa',
  },
  darkAccentText: {
    color: '#60a5fa',
  },
});