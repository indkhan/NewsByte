import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Text } from 'react-native';
import { NewsCard } from '@/components/NewsCard';
import { Article } from '@/types/news';
import axios from 'axios';
import { useTheme } from '@/app/context/ThemeContext';
import { useAuth, NewsCategory } from '@/app/context/AuthContext';

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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>(SAMPLE_NEWS);
  const [isLoading, setIsLoading] = useState(true);

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

  const renderItem = ({ item, index }: { item: Article; index: number }) => (
    <View style={styles.cardContainer}>
      <NewsCard article={item} index={index} />
    </View>
  );

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

      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.url || index.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="start"
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContent}
      />
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
  cardContainer: {
    height: SCREEN_HEIGHT - 60, // Adjust for tab bar
    width: '100%',
  },
  flatListContent: {
    flexGrow: 1,
  },
  preferencesBar: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  darkPreferencesBar: {
    backgroundColor: '#222',
    borderBottomColor: '#333',
  },
  preferencesText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666',
  },
  darkText: {
    color: '#aaa',
  }
});