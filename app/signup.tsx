import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { useAuth, Language, NewsCategory } from './context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from './context/ThemeContext';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

// News category options with labels
const CATEGORIES: { id: NewsCategory; label: string }[] = [
  { id: 'general', label: 'General News' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
  { id: 'politics', label: 'Political News' },
  { id: 'science', label: 'Science' },
  { id: 'technology', label: 'Technology' }
];

// Language options
const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German (Deutsch)' }
];

export default function SignupScreen() {
  const { isDark } = useTheme();
  const { signup } = useAuth();
  const router = useRouter();
  
  // User details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // User preferences
  const [language, setLanguage] = useState<Language>('en');
  const [selectedCategories, setSelectedCategories] = useState<NewsCategory[]>(['general']);
  const [showCategories, setShowCategories] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // Toggle category selection
  const toggleCategory = (category: NewsCategory) => {
    if (selectedCategories.includes(category)) {
      // Don't remove if it's the last selected category
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Check if a category is selected
  const isCategorySelected = (category: NewsCategory) => {
    return selectedCategories.includes(category);
  };

  // Set the selected language
  const selectLanguage = (value: Language) => {
    setLanguage(value);
    setShowLanguages(false);
  };

  // Get the selected language label
  const getSelectedLanguageLabel = () => {
    return LANGUAGES.find(l => l.value === language)?.label || 'English';
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await signup(name, email, password, language, selectedCategories);
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Email already in use or registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during registration');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/login' as any);
  };

  return (
    <ScrollView 
      style={[styles.container, isDark && styles.darkContainer]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkText]}>Create Account</Text>
        <Text style={[styles.subtitle, isDark && styles.darkSubtitle]}>
          Join Newsbyte to personalize your news experience
        </Text>
      </View>

      <View style={styles.form}>
        {/* Basic info section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Your Information</Text>
          
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            placeholder="Full Name"
            placeholderTextColor={isDark ? '#aaa' : '#999'}
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            placeholder="Email"
            placeholderTextColor={isDark ? '#aaa' : '#999'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            placeholder="Password"
            placeholderTextColor={isDark ? '#aaa' : '#999'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Language preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Language Preference</Text>
          
          <TouchableOpacity 
            style={[styles.dropdown, isDark && styles.darkDropdown]} 
            onPress={() => setShowLanguages(!showLanguages)}
          >
            <Text style={[styles.dropdownText, isDark && styles.darkText]}>
              {getSelectedLanguageLabel()}
            </Text>
            {showLanguages ? 
              <ChevronUp size={20} color={isDark ? '#fff' : '#333'} /> : 
              <ChevronDown size={20} color={isDark ? '#fff' : '#333'} />
            }
          </TouchableOpacity>
          
          {showLanguages && (
            <View style={[styles.dropdownMenu, isDark && styles.darkDropdownMenu]}>
              {LANGUAGES.map((item) => (
                <TouchableOpacity 
                  key={item.value}
                  style={[
                    styles.dropdownItem,
                    language === item.value && styles.selectedItem,
                    isDark && language === item.value && styles.darkSelectedItem
                  ]}
                  onPress={() => selectLanguage(item.value)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    isDark && styles.darkText,
                    language === item.value && styles.selectedItemText
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* News categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>News Interests</Text>
            <TouchableOpacity onPress={() => setShowCategories(!showCategories)}>
              {showCategories ? 
                <ChevronUp size={20} color={isDark ? '#fff' : '#333'} /> : 
                <ChevronDown size={20} color={isDark ? '#fff' : '#333'} />
              }
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.sectionSubtitle, isDark && styles.darkSubtitle]}>
            Select the categories you're interested in
          </Text>
          
          {showCategories && (
            <View style={styles.categoriesContainer}>
              {CATEGORIES.map((category) => (
                <View key={category.id} style={styles.categoryRow}>
                  <Text style={[styles.categoryText, isDark && styles.darkText]}>
                    {category.label}
                  </Text>
                  <Switch
                    value={isCategorySelected(category.id)}
                    onValueChange={() => toggleCategory(category.id)}
                    trackColor={{ false: '#767577', true: '#007AFF' }}
                    thumbColor={isCategorySelected(category.id) ? '#fff' : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.darkText]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.linkText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#000',
    marginBottom: 8,
  },
  darkText: {
    color: '#fff',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  darkSubtitle: {
    color: '#aaa',
  },
  form: {
    width: '100%',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  darkInput: {
    backgroundColor: '#222',
    color: '#fff',
  },
  dropdown: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkDropdown: {
    backgroundColor: '#222',
  },
  dropdownText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#333',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  darkDropdownMenu: {
    backgroundColor: '#222',
    borderColor: '#333',
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedItem: {
    backgroundColor: '#f0f8ff',
  },
  darkSelectedItem: {
    backgroundColor: '#0d2137',
  },
  dropdownItemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    color: '#007AFF',
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 4,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#007AFF',
  },
}); 