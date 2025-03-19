import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '@/types/news';
import { useAuth } from './AuthContext';

// Comment interface
export interface Comment {
  id: string;
  user: string;
  text: string;
  time: string;
  articleId: string;
}

// User actions context type
interface UserActionsContextType {
  likedArticles: string[];
  bookmarkedArticles: Article[];
  comments: Record<string, Comment[]>;
  toggleLike: (articleUrl: string) => Promise<boolean>;
  toggleBookmark: (article: Article) => Promise<boolean>;
  isLiked: (articleUrl: string) => boolean;
  isBookmarked: (articleUrl: string) => boolean;
  addComment: (articleId: string, text: string) => Promise<boolean>;
  getArticleComments: (articleId: string) => Comment[];
  getBookmarkedArticles: () => Article[];
}

// Create context
const UserActionsContext = createContext<UserActionsContextType>({
  likedArticles: [],
  bookmarkedArticles: [],
  comments: {},
  toggleLike: async () => false,
  toggleBookmark: async () => false,
  isLiked: () => false,
  isBookmarked: () => false,
  addComment: async () => false,
  getArticleComments: () => [],
  getBookmarkedArticles: () => [],
});

// Storage keys
const LIKES_STORAGE_KEY = 'newsbyte_likes';
const BOOKMARKS_STORAGE_KEY = 'newsbyte_bookmarks';
const COMMENTS_STORAGE_KEY = 'newsbyte_comments';

export function UserActionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});

  // Load data from storage when user changes
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Load liked articles
          const storedLikes = await AsyncStorage.getItem(`${LIKES_STORAGE_KEY}_${user.email}`);
          if (storedLikes) {
            setLikedArticles(JSON.parse(storedLikes));
          }

          // Load bookmarked articles
          const storedBookmarks = await AsyncStorage.getItem(`${BOOKMARKS_STORAGE_KEY}_${user.email}`);
          if (storedBookmarks) {
            setBookmarkedArticles(JSON.parse(storedBookmarks));
          }

          // Load comments
          const storedComments = await AsyncStorage.getItem(`${COMMENTS_STORAGE_KEY}_${user.email}`);
          if (storedComments) {
            setComments(JSON.parse(storedComments));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        // Clear data if no user is logged in
        setLikedArticles([]);
        setBookmarkedArticles([]);
        setComments({});
      }
    };

    loadUserData();
  }, [user]);

  // Toggle like for an article
  const toggleLike = async (articleUrl: string): Promise<boolean> => {
    if (!user) return false;

    try {
      let newLikedArticles: string[];
      
      if (likedArticles.includes(articleUrl)) {
        // Remove from likes
        newLikedArticles = likedArticles.filter(url => url !== articleUrl);
      } else {
        // Add to likes
        newLikedArticles = [...likedArticles, articleUrl];
      }
      
      // Update state
      setLikedArticles(newLikedArticles);
      
      // Save to storage
      await AsyncStorage.setItem(`${LIKES_STORAGE_KEY}_${user.email}`, JSON.stringify(newLikedArticles));
      
      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  };

  // Toggle bookmark for an article
  const toggleBookmark = async (article: Article): Promise<boolean> => {
    if (!user) return false;

    try {
      let newBookmarkedArticles: Article[];
      
      if (isBookmarked(article.url)) {
        // Remove from bookmarks
        newBookmarkedArticles = bookmarkedArticles.filter(a => a.url !== article.url);
      } else {
        // Add to bookmarks
        newBookmarkedArticles = [...bookmarkedArticles, article];
      }
      
      // Update state
      setBookmarkedArticles(newBookmarkedArticles);
      
      // Save to storage
      await AsyncStorage.setItem(`${BOOKMARKS_STORAGE_KEY}_${user.email}`, JSON.stringify(newBookmarkedArticles));
      
      return true;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return false;
    }
  };

  // Check if article is liked
  const isLiked = (articleUrl: string): boolean => {
    return likedArticles.includes(articleUrl);
  };

  // Check if article is bookmarked
  const isBookmarked = (articleUrl: string): boolean => {
    return bookmarkedArticles.some(article => article.url === articleUrl);
  };

  // Add a comment to an article
  const addComment = async (articleId: string, text: string): Promise<boolean> => {
    if (!user || !text.trim()) return false;

    try {
      // Create new comment
      const newComment: Comment = {
        id: Date.now().toString(),
        user: user.name,
        text: text.trim(),
        time: 'Just now',
        articleId
      };
      
      // Update comments state
      const articleComments = comments[articleId] || [];
      const newComments = {
        ...comments,
        [articleId]: [...articleComments, newComment]
      };
      
      setComments(newComments);
      
      // Save to storage
      await AsyncStorage.setItem(`${COMMENTS_STORAGE_KEY}_${user.email}`, JSON.stringify(newComments));
      
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  // Get comments for an article
  const getArticleComments = (articleId: string): Comment[] => {
    return comments[articleId] || [];
  };

  // Get all bookmarked articles
  const getBookmarkedArticles = (): Article[] => {
    return bookmarkedArticles;
  };

  return (
    <UserActionsContext.Provider
      value={{
        likedArticles,
        bookmarkedArticles,
        comments,
        toggleLike,
        toggleBookmark,
        isLiked,
        isBookmarked,
        addComment,
        getArticleComments,
        getBookmarkedArticles,
      }}
    >
      {children}
    </UserActionsContext.Provider>
  );
}

// Hook to use the context
export const useUserActions = () => useContext(UserActionsContext); 