import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { NewsCard } from '@/components/NewsCard';
import { Article } from '@/types/news';
import axios from 'axios';
import { useTheme } from '@/app/context/ThemeContext';
import { useAuth, NewsCategory } from '@/app/context/AuthContext';
import Swiper from 'react-native-swiper';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react-native';



const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch news based on user preferences
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      if (user?.preferences) {
        const { language, categories } = user.preferences;
        const country = language === 'en' ? 'us' : 'de';
        
        try {
          // Fetch articles for each selected category in parallel
          // We use the saurav.tech mirror which doesn't require an API key and is CORS-friendly
          const fetchPromises = categories.map((category: NewsCategory) => 
            axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${category}/${country}.json`)
          );
          
          const responses = await Promise.all(fetchPromises);
          let allArticles: Article[] = [];
          
          responses.forEach((response: any) => {
            if (response.data && response.data.articles) {
              allArticles = [...allArticles, ...response.data.articles];
            }
          });
          
          // Randomize or sort articles if needed, for now just merge
          if (allArticles.length > 0) {
            // Remove duplicates based on URL
            const uniqueArticles = allArticles.filter((article: Article, index: number, self: Article[]) =>
              index === self.findIndex((a: Article) => a.url === article.url)
            );
            setArticles(uniqueArticles);
          } else {
            setArticles([]);
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
          setArticles([]);
        }
      } else {
        // Fallback to empty news if no preferences or not logged in
        setArticles([]);
      }
    } catch (error) {
      console.error('Error in fetchNews:', error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [user]);

  // Open article in browser
  const openArticleInBrowser = (url: string) => {
    if (url) {
      Alert.alert(
        "Open Article",
        "Would you like to view the full article in your browser?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open", onPress: () => Linking.openURL(url) }
        ]
      );
    }
  };

  // Handle index change
  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.centered]}>
        <ActivityIndicator size="large" color={isDark ? "#fff" : "#007AFF"} />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>Fetching latest news...</Text>
      </View>
    );
  }

  if (articles.length === 0) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer, styles.centered]}>
        <Text style={[styles.emptyText, isDark && styles.darkText]}>No articles found for your preferences.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchNews}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {user?.preferences && (
        <View style={[styles.preferencesBar, isDark && styles.darkPreferencesBar]}>
          <Text style={[styles.preferencesText, isDark && styles.darkText]}>
            Showing news in {user.preferences.language === 'en' ? 'English' : 'German'} for{' '}
            {user.preferences.categories.map((cat: NewsCategory, index: number) => (
              <Text key={cat}>
                {index > 0 ? ', ' : ''}
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            ))}
          </Text>
        </View>
      )}

      <View style={styles.swiperContainer}>
        <Swiper
          horizontal={false}
          showsButtons={false}
          loop={false}
          index={currentIndex}
          onIndexChanged={handleIndexChange}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          paginationStyle={styles.pagination}
          dotColor={isDark ? "#555" : "#ccc"}
          activeDotColor={isDark ? "#fff" : "#007AFF"}
        >
          {articles.map((article: Article, index: number) => (
            <View key={article.url || index} style={styles.slide}>
              <NewsCard article={article} index={index} />
            </View>
          ))}
        </Swiper>
      </View>

      <View style={styles.openBrowserButton}>
        <TouchableOpacity 
          style={[styles.browserButton, isDark && styles.darkBrowserButton]}
          onPress={() => openArticleInBrowser(articles[currentIndex]?.url)}
        >
          <ExternalLink size={18} color={isDark ? "#fff" : "#333"} />
          <Text style={[styles.browserButtonText, isDark && styles.darkText]}>
            Open in Browser
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navigationControls}>
        <View style={styles.navButtonsContainer}>
          <TouchableOpacity 
            style={[styles.navButton, isDark && styles.darkNavButton]} 
            onPress={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            <ChevronUp size={22} color={currentIndex === 0 ? '#ccc' : (isDark ? '#fff' : '#333')} />
            <Text style={[styles.navButtonText, isDark && styles.darkText, currentIndex === 0 && styles.disabledText]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, isDark && styles.darkNavButton]} 
            onPress={() => currentIndex < articles.length - 1 && setCurrentIndex(currentIndex + 1)}
            disabled={currentIndex === articles.length - 1}
          >
            <Text style={[styles.navButtonText, isDark && styles.darkText, currentIndex === articles.length - 1 && styles.disabledText]}>
              Next
            </Text>
            <ChevronDown size={22} color={currentIndex === articles.length - 1 ? '#ccc' : (isDark ? '#fff' : '#333')} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.swipeInstructions}>
        <Text style={[styles.instructionText, isDark && styles.darkInstructionText]}>
          Swipe up/down to navigate news
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
  swiperContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferencesBar: {
    padding: 10,
    backgroundColor: 'rgba(240, 240, 240, 0.95)',
    alignItems: 'center',
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkPreferencesBar: {
    backgroundColor: 'rgba(34, 34, 34, 0.95)',
    borderBottomColor: '#333',
  },
  preferencesText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666',
  },
  darkText: {
    color: '#aaa',
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDotStyle: {
    width: 16,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  pagination: {
    right: 10,
    position: 'absolute',
  },
  openBrowserButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 10,
  },
  browserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkBrowserButton: {
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
  },
  browserButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#333',
    marginLeft: 6,
  },
  navigationControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 10,
    zIndex: 10,
  },
  navButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkNavButton: {
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
  },
  navButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#333',
    marginHorizontal: 4,
  },
  disabledText: {
    color: '#ccc',
  },
  swipeInstructions: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#777',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  darkInstructionText: {
    color: '#aaa',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  }
});