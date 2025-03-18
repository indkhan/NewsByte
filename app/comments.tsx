import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from './context/ThemeContext';
import { Send } from 'lucide-react-native';

const DUMMY_COMMENTS = [
  { id: '1', user: 'John Doe', text: 'Great article!', time: '2h ago' },
  { id: '2', user: 'Jane Smith', text: 'Very informative, thanks for sharing.', time: '1h ago' },
  { id: '3', user: 'Mike Johnson', text: 'Interesting perspective.', time: '30m ago' },
];

export default function CommentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();

  const renderComment = ({ item }: { item: typeof DUMMY_COMMENTS[0] }) => (
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
        <FlatList
          data={DUMMY_COMMENTS}
          renderItem={renderComment}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.commentsList}
        />
        
        <View style={[styles.inputContainer, isDark && styles.darkInputContainer]}>
          <TextInput
            placeholder="Add a comment..."
            placeholderTextColor={isDark ? '#666' : '#999'}
            style={[styles.input, isDark && styles.darkInput]}
          />
          <Pressable style={styles.sendButton}>
            <Send size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
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
  darkText: {
    color: '#fff',
  },
});