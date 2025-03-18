import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Pressable } from 'react-native';
import { Bell, Moon, Globe, Share2, Info, LogOut, User } from 'lucide-react-native';
import { useTheme } from '@/app/context/ThemeContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

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

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Bell size={24} color={isDark ? '#fff' : '#333'} />
            <Text style={[styles.settingText, isDark && styles.darkText]}>Push Notifications</Text>
          </View>
          <Switch value={true} onValueChange={() => {}} />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Globe size={24} color={isDark ? '#fff' : '#333'} />
            <Text style={[styles.settingText, isDark && styles.darkText]}>Region</Text>
          </View>
          <Text style={[styles.settingValue, isDark && { color: '#60a5fa' }]}>United States</Text>
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
});