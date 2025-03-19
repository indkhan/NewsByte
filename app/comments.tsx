import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTheme } from './context/ThemeContext';
import { useUserActions } from './context/UserActionsContext';
import { useAuth } from './context/AuthContext';
import { Send } from 'lucide-react-native';

export default function CommentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { getArticleComments, addComment } = useUserActions();
  
  const [comments, setComments] = useState(getArticleComments(id || '0'));
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reload comments when they change
  useEffect(() => {
    setComments(getArticleComments(id || '0'));
  }, [id, getArticleComments]);

  const handleSubmitComment = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to add comments', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/login' as any) }
      ]);
      return;
    }

    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await addComment(id || '0', commentText);
      
      if (success) {
        // Update local comments state
        setComments(getArticleComments(id || '0'));
        setCommentText(''); // Clear input
      } else {
        Alert.alert('Error', 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComment = ({ item }: { item: ReturnType<typeof getArticleComments>[0] }) => (
    <View style={[styles.commentContainer, isDark && styles.darkCommentContainer]}>
      <Text style={[styles.username, isDark && styles.darkText]}>{item.user}</Text>
      <Text style={[styles.commentText, isDark && styles.darkText]}>{item.text}</Text>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Comments',
          headerStyle: {
            backgroundColor: isDark ? '#111' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
      />
      <View style={[styles.container, isDark && styles.darkContainer]}>
        {comments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && styles.darkText]}>
              No comments yet. Be the first to comment!
            </Text>
          </View>
        ) : (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.commentsList}
          />
        )}
        
        <View style={[styles.inputContainer, isDark && styles.darkInputContainer]}>
          <TextInput
            placeholder="Add a comment..."
            placeholderTextColor={isDark ? '#666' : '#999'}
            style={[styles.input, isDark && styles.darkInput]}
            value={commentText}
            onChangeText={setCommentText}
            editable={!isSubmitting}
          />
          {isSubmitting ? (
            <ActivityIndicator color={isDark ? '#fff' : '#007AFF'} />
          ) : (
            <Pressable 
              style={[styles.sendButton, !commentText.trim() && styles.disabledButton]} 
              onPress={handleSubmitComment}
              disabled={!commentText.trim()}
            >
              <Send size={24} color={!commentText.trim() ? '#999' : (isDark ? '#fff' : '#007AFF')} />
            </Pressable>
          )}
        </View>
      </View>
    </>
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
  commentsList: {
    padding: 16,
  },
  commentContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  darkCommentContainer: {
    backgroundColor: '#111',
  },
  username: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  commentText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  timeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  darkInputContainer: {
    backgroundColor: '#111',
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 12,
    fontFamily: 'Inter_400Regular',
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  darkText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});