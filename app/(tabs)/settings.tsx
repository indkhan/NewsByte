import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Pressable, Modal, TouchableOpacity } from 'react-native';
import { Bell, Moon, Globe, Share2, Info, LogOut, User, ChevronDown, ChevronUp, Edit } from 'lucide-react-native';
import { useTheme } from '@/app/context/ThemeContext';
import { useAuth, NewsCategory, Language } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router';

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

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, updatePreferences } = useAuth();
  const router = useRouter();

  // State for preferences modal
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(user?.preferences?.language || 'en');
  const [selectedCategories, setSelectedCategories] = useState<NewsCategory[]>(
    user?.preferences?.categories || ['general']
  );

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

  // Save updated preferences
  const savePreferences = async () => {
    if (user) {
      await updatePreferences(selectedLanguage, selectedCategories);
      setShowPreferencesModal(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>Settings</Text>
      </View>

      {user && (
        <View style={[styles.section, isDark && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Profile</Text>
          
          <View style={styles.profileInfo}>
            <View style={styles.profileIcon}>
              <User size={32} color={isDark ? '#fff' : '#333'} />
            </View>
            <View>
              <Text style={[styles.profileName, isDark && styles.darkText]}>{user.name}</Text>
              <Text style={[styles.profileEmail, isDark && styles.darkText]}>{user.email}</Text>
            </View>
          </View>
        </View>
      )}
      
      <View style={[styles.section, isDark && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Preferences</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Moon size={24} color={isDark ? '#fff' : '#333'} />
            <Text style={[styles.settingText, isDark && styles.darkText]}>Dark Mode</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        <Pressable 
          style={styles.setting}
          onPress={() => setShowPreferencesModal(true)}
        >
          <View style={styles.settingInfo}>
            <Globe size={24} color={isDark ? '#fff' : '#333'} />
            <Text style={[styles.settingText, isDark && styles.darkText]}>News Preferences</Text>
          </View>
          <Edit size={20} color={isDark ? '#fff' : '#333'} />
        </Pressable>

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Bell size={24} color={isDark ? '#fff' : '#333'} />
            <Text style={[styles.settingText, isDark && styles.darkText]}>Push Notifications</Text>
          </View>
          <Switch value={true} onValueChange={() => {}} />
        </View>
      </View>

      <View style={[styles.section, isDark && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>More</Text>
        
        <Pressable style={styles.setting}>
          <View style={styles.settingInfo}>
            <Share2 size={24} color={isDark ? '#fff' : '#333'} />
            <Text style={[styles.settingText, isDark && styles.darkText]}>Share App</Text>
          </View>
        </Pressable>

        <Pressable style={styles.setting}>
          <View style={styles.settingInfo}>
            <Info size={24} color={isDark ? '#fff' : '#333'} />
            <Text style={[styles.settingText, isDark && styles.darkText]}>About</Text>
          </View>
        </Pressable>
      </View>

      <Pressable 
        style={[styles.logoutButton, isDark && styles.darkLogoutButton]} 
        onPress={handleLogout}
      >
        <LogOut size={20} color={isDark ? '#fff' : '#ff3b30'} />
        <Text style={[styles.logoutText, isDark && styles.darkLogoutText]}>Log Out</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={[styles.version, isDark && styles.darkText]}>Version 1.0.0</Text>
      </View>

      {/* Preferences Modal */}
      <Modal
        visible={showPreferencesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPreferencesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.darkModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.darkText]}>News Preferences</Text>
              <TouchableOpacity onPress={() => setShowPreferencesModal(false)}>
                <Text style={styles.modalClose}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Language Selector */}
            <View style={styles.preferencesSection}>
              <Text style={[styles.preferenceTitle, isDark && styles.darkText]}>Language</Text>
              <View style={styles.languageOptions}>
                {LANGUAGES.map((item) => (
                  <TouchableOpacity 
                    key={item.value}
                    style={[
                      styles.languageOption, 
                      selectedLanguage === item.value && styles.selectedLanguage,
                      isDark && styles.darkLanguageOption,
                      isDark && selectedLanguage === item.value && styles.darkSelectedLanguage
                    ]}
                    onPress={() => setSelectedLanguage(item.value)}
                  >
                    <Text style={[
                      styles.languageText,
                      selectedLanguage === item.value && styles.selectedLanguageText,
                      isDark && styles.darkText
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.preferencesSection}>
              <Text style={[styles.preferenceTitle, isDark && styles.darkText]}>News Categories</Text>
              <Text style={[styles.preferenceSubtitle, isDark && styles.darkSubtitle]}>
                Select the categories you want to see
              </Text>
              
              <View style={styles.categoriesContainer}>
                {CATEGORIES.map((category) => (
                  <View key={category.id} style={styles.categoryRow}>
                    <Text style={[styles.categoryText, isDark && styles.darkText]}>
                      {category.label}
                    </Text>
                    <Switch
                      value={selectedCategories.includes(category.id)}
                      onValueChange={() => toggleCategory(category.id)}
                      trackColor={{ false: '#767577', true: '#007AFF' }}
                      thumbColor={selectedCategories.includes(category.id) ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={savePreferences}
            >
              <Text style={styles.saveButtonText}>Save Preferences</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  darkSection: {
    backgroundColor: '#111',
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#007AFF',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    marginTop: 16,
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff3b30',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  darkLogoutButton: {
    borderColor: '#fff',
  },
  logoutText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ff3b30',
  },
  darkLogoutText: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
  },
  darkText: {
    color: '#fff',
  },
  darkSubtitle: {
    color: '#aaa',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  darkModalContent: {
    backgroundColor: '#111',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000',
  },
  modalClose: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#007AFF',
  },
  preferencesSection: {
    marginTop: 20,
  },
  preferenceTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 12,
  },
  preferenceSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  languageOption: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
  },
  darkLanguageOption: {
    borderColor: '#333',
  },
  selectedLanguage: {
    backgroundColor: '#f0f8ff',
    borderColor: '#007AFF',
  },
  darkSelectedLanguage: {
    backgroundColor: '#0d2137',
    borderColor: '#007AFF',
  },
  languageText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#007AFF',
    fontFamily: 'Inter_600SemiBold',
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
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});