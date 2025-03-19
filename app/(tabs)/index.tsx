import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { NewsCard } from '@/components/NewsCard';
import { Article } from '@/types/news';
import axios from 'axios';
import { useTheme } from '@/app/context/ThemeContext';
import { useAuth, NewsCategory } from '@/app/context/AuthContext';
import Swiper from 'react-native-swiper';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react-native';

// Sample news data for development
const SAMPLE_NEWS = [
  {
    title: "The Future of Technology",
    description: "Exploring the latest trends in technology and their impact on our daily lives.",
    content: "Technology continues to evolve at an unprecedented pace, transforming how we live, work, and interact with one another...",
    url: "https://example.com/tech-future",
    urlToImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    publishedAt: "2024-02-20T09:00:00Z",
    source: { name: "Tech Daily" }
  },
  {
    title: "Sustainable Living in Modern Cities",
    description: "How urban areas are adapting to environmental challenges.",
    content: "Cities around the world are implementing innovative solutions to reduce their environmental impact...",
    url: "https://example.com/sustainable-cities",
    urlToImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80",
    publishedAt: "2024-02-20T10:00:00Z",
    source: { name: "Environment Today" }
  },
  {
    title: "The Rise of Digital Art",
    description: "How technology is revolutionizing artistic expression.",
    content: "Digital artists are pushing the boundaries of creativity using new tools and platforms...",
    url: "https://example.com/digital-art",
    urlToImage: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
    publishedAt: "2024-02-20T11:00:00Z",
    source: { name: "Art & Culture" }
  }
];

// Sample news by category for development (when API is not available)
const SAMPLE_NEWS_BY_CATEGORY: Record<NewsCategory, Article[]> = {
  general: [
    {
      title: "Global Summit Addresses Climate Change",
      description: "Leaders from around the world gather to discuss environmental policies.",
      content: "The annual Global Climate Summit brought together world leaders to address the pressing issues of climate change...",
      url: "https://example.com/climate-summit",
      urlToImage: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80",
      publishedAt: "2024-02-21T09:00:00Z",
      source: { name: "World News" }
    }
  ],
  entertainment: [
    {
      title: "New Blockbuster Movie Breaks Box Office Records",
      description: "The latest superhero film becomes the highest-grossing movie of the year.",
      content: "Hollywood is celebrating as the new superhero epic has shattered box office records worldwide...",
      url: "https://example.com/movie-record",
      urlToImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
      publishedAt: "2024-02-20T15:30:00Z",
      source: { name: "Entertainment Weekly" }
    }
  ],
  sports: [
    {
      title: "Championship Finals Set to Begin Next Week",
      description: "The two top teams prepare for the ultimate showdown.",
      content: "After a season of intense competition, the championship finals are set to begin next week between the two top-ranked teams...",
      url: "https://example.com/championship-finals",
      urlToImage: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80",
      publishedAt: "2024-02-22T12:45:00Z",
      source: { name: "Sports Center" }
    }
  ],
  politics: [
    {
      title: "Key Legislation Passes in Parliament",
      description: "Lawmakers approve historic bill after months of debate.",
      content: "After months of intense debate and negotiation, parliament has finally passed the landmark legislation that will reshape the nation's approach to...",
      url: "https://example.com/legislation-passes",
      urlToImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80",
      publishedAt: "2024-02-19T14:20:00Z",
      source: { name: "Political Times" }
    }
  ],
  science: [
    {
      title: "Scientists Discover New Species in Deep Ocean",
      description: "Researchers document previously unknown marine life in deep-sea expedition.",
      content: "Marine biologists have discovered several new species during a deep-sea expedition to unexplored ocean trenches...",
      url: "https://example.com/ocean-discovery",
      urlToImage: "https://images.unsplash.com/photo-1566731855570-b3a97a486b9c?w=800&q=80",
      publishedAt: "2024-02-18T10:15:00Z",
      source: { name: "Science Daily" }
    }
  ],
  technology: [
    {
      title: "Revolutionary AI System Developed for Medical Diagnostics",
      description: "New artificial intelligence platform shows promising results in early disease detection.",
      content: "A team of researchers has developed a revolutionary AI system that can detect early signs of multiple diseases with unprecedented accuracy...",
      url: "https://example.com/ai-medical",
      urlToImage: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80",
      publishedAt: "2024-02-21T08:30:00Z",
      source: { name: "Tech Innovations" }
    }
  ]
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>(SAMPLE_NEWS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch news based on user preferences
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      if (user?.preferences) {
        const { language, categories } = user.preferences;
        
        // Use this for actual API call when you have an API key
        // const response = await axios.get(
        //   `https://newsapi.org/v2/top-headlines?country=${language === 'en' ? 'us' : 'de'}&category=${categories[0]}&apiKey=${process.env.EXPO_PUBLIC_NEWS_API_KEY}`
        // );
        // setArticles(response.data.articles);
        
        // For development, use sample data based on user preferences
        let preferredNews: Article[] = [];
        
        // Collect articles for each selected category
        categories.forEach(category => {
          preferredNews = [...preferredNews, ...SAMPLE_NEWS_BY_CATEGORY[category]];
        });
        
        // If no preferred news found, use general news
        if (preferredNews.length === 0) {
          setArticles(SAMPLE_NEWS);
        } else {
          setArticles(preferredNews);
        }
      } else {
        // Fallback to sample news if no preferences
        setArticles(SAMPLE_NEWS);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setArticles(SAMPLE_NEWS);
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

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {user?.preferences && (
        <View style={[styles.preferencesBar, isDark && styles.darkPreferencesBar]}>
          <Text style={[styles.preferencesText, isDark && styles.darkText]}>
            Showing news in {user.preferences.language === 'en' ? 'English' : 'German'} for{' '}
            {user.preferences.categories.map((cat, index) => (
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
          {articles.map((article, index) => (
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
  }
});