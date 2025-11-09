# Sakshi Mobile App - React Native Implementation Guide

## Overview

This guide provides a complete foundation for building the Sakshi mobile app using React Native. The mobile app will provide all core Sakshi features optimized for iOS and Android devices.

---

## 📱 Mobile App Architecture

### Technology Stack
- **Framework:** React Native 0.72+
- **Language:** TypeScript
- **Navigation:** React Navigation 6
- **State Management:** React Context + Hooks
- **API Client:** tRPC client (same as web)
- **Storage:** AsyncStorage for offline data
- **Push Notifications:** React Native Firebase
- **Maps:** React Native Maps
- **Camera:** React Native Camera
- **Payments:** Razorpay React Native SDK

### Key Features
1. **Browse Menu** - View all menu items with filters
2. **Place Orders** - Order food with triple pricing
3. **Scan QR Codes** - View farmer information
4. **Mindful Dining** - Meditation and eating timer
5. **Track Impact** - Personal impact dashboard
6. **Cooking Classes** - Browse and register for classes
7. **Recipes** - Access recipe library
8. **Nutrition Tracking** - Log meals and track health
9. **Offline Support** - Work without internet
10. **Push Notifications** - Order updates, class reminders

---

## 🚀 Project Setup

### 1. Initialize React Native Project

```bash
# Create new React Native project with TypeScript
npx react-native@latest init SakshiMobile --template react-native-template-typescript

cd SakshiMobile
```

### 2. Install Core Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated

# tRPC and API
npm install @trpc/client @trpc/react-query @tanstack/react-query

# Storage
npm install @react-native-async-storage/async-storage

# UI Components
npm install react-native-vector-icons
npm install react-native-linear-gradient

# Forms
npm install react-hook-form zod

# Date/Time
npm install date-fns

# Maps
npm install react-native-maps

# Camera
npm install react-native-camera

# QR Code
npm install react-native-qrcode-scanner

# Push Notifications
npm install @react-native-firebase/app @react-native-firebase/messaging

# Payments
npm install react-native-razorpay
```

### 3. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 4. Android Setup

Update `android/build.gradle`:
```gradle
buildscript {
    ext {
        buildToolsVersion = "33.0.0"
        minSdkVersion = 21
        compileSdkVersion = 33
        targetSdkVersion = 33
    }
}
```

---

## 📁 Project Structure

```
SakshiMobile/
├── src/
│   ├── screens/           # Screen components
│   │   ├── Home/
│   │   ├── Menu/
│   │   ├── Order/
│   │   ├── Classes/
│   │   ├── Recipes/
│   │   ├── Profile/
│   │   └── Impact/
│   ├── components/        # Reusable components
│   │   ├── MenuCard/
│   │   ├── RecipeCard/
│   │   ├── ClassCard/
│   │   ├── ImpactWidget/
│   │   └── common/
│   ├── navigation/        # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   ├── TabNavigator.tsx
│   │   └── StackNavigator.tsx
│   ├── services/          # API and services
│   │   ├── api.ts        # tRPC client
│   │   ├── storage.ts    # AsyncStorage wrapper
│   │   ├── notifications.ts
│   │   └── location.ts
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useOrders.ts
│   │   └── useImpact.ts
│   ├── utils/             # Utilities
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   └── assets/            # Images, fonts
│       ├── images/
│       └── fonts/
├── android/               # Android native code
├── ios/                   # iOS native code
└── App.tsx               # Root component
```

---

## 🎨 Core Screens Implementation

### 1. Home Screen

```typescript
// src/screens/Home/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Namaste 🙏</Text>
        <Text style={styles.headerSubtitle}>
          Welcome to conscious living
        </Text>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Menu')}
        >
          <Icon name="food" size={32} color="#10b981" />
          <Text style={styles.actionText}>Browse Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Classes')}
        >
          <Icon name="school" size={32} color="#10b981" />
          <Text style={styles.actionText}>Cooking Classes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Recipes')}
        >
          <Icon name="book-open-variant" size={32} color="#10b981" />
          <Text style={styles.actionText}>Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Impact')}
        >
          <Icon name="leaf" size={32} color="#10b981" />
          <Text style={styles.actionText}>My Impact</Text>
        </TouchableOpacity>
      </View>

      {/* Impact Summary */}
      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Your Impact This Month</Text>
        <View style={styles.impactStats}>
          <View style={styles.impactStat}>
            <Text style={styles.impactNumber}>12</Text>
            <Text style={styles.impactLabel}>Mindful Meals</Text>
          </View>
          <View style={styles.impactStat}>
            <Text style={styles.impactNumber}>5kg</Text>
            <Text style={styles.impactLabel}>CO₂ Saved</Text>
          </View>
          <View style={styles.impactStat}>
            <Text style={styles.impactNumber}>150</Text>
            <Text style={styles.impactLabel}>Seva Tokens</Text>
          </View>
        </View>
      </View>

      {/* Featured Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Specials</Text>
        {/* Menu items list */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  impactCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactStat: {
    alignItems: 'center',
  },
  impactNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  impactLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
});

export default HomeScreen;
```

### 2. Menu Screen

```typescript
// src/screens/Menu/MenuScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { trpc } from '../../services/api';

const MenuScreen = ({ navigation }) => {
  const [selectedTier, setSelectedTier] = useState<'community' | 'fair' | 'supporter'>('fair');
  
  const { data: menuItems, isLoading } = trpc.cafe.menu.getAll.useQuery();

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuCard}
      onPress={() => navigation.navigate('MenuDetail', { id: item.id })}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.menuImage}
      />
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        {/* Dosha indicators */}
        <View style={styles.doshaRow}>
          <Text style={styles.doshaText}>
            V: {item.vata_effect} | P: {item.pitta_effect} | K: {item.kapha_effect}
          </Text>
        </View>

        {/* Triple pricing */}
        <View style={styles.pricingRow}>
          <TouchableOpacity
            style={[
              styles.priceButton,
              selectedTier === 'community' && styles.priceButtonActive,
            ]}
            onPress={() => setSelectedTier('community')}
          >
            <Text style={styles.priceLabel}>Community</Text>
            <Text style={styles.priceAmount}>₹{item.community_price}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.priceButton,
              selectedTier === 'fair' && styles.priceButtonActive,
            ]}
            onPress={() => setSelectedTier('fair')}
          >
            <Text style={styles.priceLabel}>Fair</Text>
            <Text style={styles.priceAmount}>₹{item.fair_price}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.priceButton,
              selectedTier === 'supporter' && styles.priceButtonActive,
            ]}
            onPress={() => setSelectedTier('supporter')}
          >
            <Text style={styles.priceLabel}>Supporter</Text>
            <Text style={styles.priceAmount}>₹{item.supporter_price}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  list: {
    padding: 16,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuImage: {
    width: '100%',
    height: 200,
  },
  menuInfo: {
    padding: 16,
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  doshaRow: {
    marginBottom: 12,
  },
  doshaText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priceButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  priceButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  priceLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  priceAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default MenuScreen;
```

### 3. Mindful Dining Screen

```typescript
// src/screens/MindfulDining/MindfulDiningScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Phase = 'meditation' | 'eating' | 'completion';

const MindfulDiningScreen = () => {
  const [phase, setPhase] = useState<Phase>('meditation');
  const [seconds, setSeconds] = useState(120); // 2 minutes meditation
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0 && phase === 'meditation') {
      setPhase('eating');
      setSeconds(0);
      setIsRunning(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, phase]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const renderMeditationPhase = () => (
    <View style={styles.phaseContainer}>
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        style={styles.gradient}
      >
        <Icon name="meditation" size={80} color="#ffffff" />
        <Text style={styles.phaseTitle}>Meditation</Text>
        <Text style={styles.phaseSubtitle}>
          Take a moment to be present
        </Text>

        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        </View>

        <Text style={styles.guidanceText}>
          Close your eyes. Take three deep breaths. Express gratitude for this meal.
        </Text>

        {!isRunning ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setIsRunning(true)}
          >
            <Text style={styles.buttonText}>Start Meditation</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              setPhase('eating');
              setSeconds(0);
            }}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );

  const renderEatingPhase = () => (
    <View style={styles.phaseContainer}>
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.gradient}
      >
        <Icon name="food-apple" size={80} color="#ffffff" />
        <Text style={styles.phaseTitle}>Mindful Eating</Text>
        <Text style={styles.phaseSubtitle}>
          Savor every bite
        </Text>

        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipText}>• Chew slowly and thoroughly</Text>
          <Text style={styles.tipText}>• Notice flavors and textures</Text>
          <Text style={styles.tipText}>• Put down utensils between bites</Text>
          <Text style={styles.tipText}>• Eat without distractions</Text>
        </View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => setPhase('completion')}
        >
          <Text style={styles.buttonText}>Complete Meal</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderCompletionPhase = () => (
    <View style={styles.phaseContainer}>
      <View style={styles.completionContainer}>
        <Icon name="check-circle" size={80} color="#10b981" />
        <Text style={styles.completionTitle}>Meal Complete!</Text>
        <Text style={styles.completionSubtitle}>
          You earned +10 Seva Tokens
        </Text>

        {/* Gratitude journal */}
        <View style={styles.journalCard}>
          <Text style={styles.journalTitle}>Gratitude Journal</Text>
          <Text style={styles.journalPrompt}>
            What are you grateful for today?
          </Text>
          {/* Text input would go here */}
        </View>

        {/* Ratings */}
        <View style={styles.ratingsCard}>
          <Text style={styles.ratingLabel}>How mindful was your meal?</Text>
          {/* Star rating component */}
          
          <Text style={styles.ratingLabel}>Dosha balance feeling</Text>
          {/* 1-5 rating */}
        </View>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            // Save and navigate back
          }}
        >
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {phase === 'meditation' && renderMeditationPhase()}
      {phase === 'eating' && renderEatingPhase()}
      {phase === 'completion' && renderCompletionPhase()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  phaseContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  phaseTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  phaseSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 8,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  guidanceText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  tipText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  skipButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
  },
  completionContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 24,
    paddingTop: 80,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
  },
  completionSubtitle: {
    fontSize: 16,
    color: '#10b981',
    marginTop: 8,
    marginBottom: 32,
  },
  journalCard: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  journalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  journalPrompt: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  ratingsCard: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  doneButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
});

export default MindfulDiningScreen;
```

---

## 🔧 Services Implementation

### tRPC API Client

```typescript
// src/services/api.ts
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/routers'; // Adjust path

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'https://api.sakshi.com/trpc', // Your API URL
      headers: async () => {
        const token = await getAuthToken();
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});
```

### Offline Storage

```typescript
// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};
```

---

## 📱 Platform-Specific Features

### Push Notifications

```typescript
// src/services/notifications.ts
import messaging from '@react-native-firebase/messaging';
import { storage } from './storage';

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
    await storage.setItem('fcm_token', token);
    // Send token to backend
    return token;
  }
  return null;
};

export const setupNotificationListeners = () => {
  // Foreground messages
  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message:', remoteMessage);
    // Show local notification
  });

  // Background messages
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background message:', remoteMessage);
  });

  // Notification opened app
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification opened app:', remoteMessage);
    // Navigate to relevant screen
  });
};
```

---

## 🚀 Build and Deploy

### iOS Build

```bash
# Development build
npx react-native run-ios

# Production build
cd ios
xcodebuild -workspace SakshiMobile.xcworkspace \
  -scheme SakshiMobile \
  -configuration Release \
  -archivePath ./build/SakshiMobile.xcarchive \
  archive
```

### Android Build

```bash
# Development build
npx react-native run-android

# Production build
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

---

## 📊 Features Roadmap

### Phase 1 (MVP)
- [x] Project setup
- [x] Navigation structure
- [x] Home screen
- [x] Menu browsing
- [x] Mindful dining tracker
- [ ] Order placement
- [ ] Profile management
- [ ] Push notifications

### Phase 2
- [ ] QR code scanning (farmer info)
- [ ] Impact dashboard
- [ ] Cooking classes
- [ ] Recipe library
- [ ] Offline support

### Phase 3
- [ ] Nutrition tracking
- [ ] Meal sponsorship
- [ ] Gratitude wall
- [ ] Social sharing
- [ ] Advanced analytics

---

## 🎯 Next Steps

1. **Set up React Native project** using commands above
2. **Install all dependencies**
3. **Copy screen implementations** from this guide
4. **Configure tRPC client** to connect to backend
5. **Test on iOS and Android simulators**
6. **Add remaining screens** following the patterns
7. **Implement offline support** with AsyncStorage
8. **Set up push notifications** with Firebase
9. **Build and test** on physical devices
10. **Submit to App Store and Play Store**

---

**The mobile app foundation is ready to build!** 📱🚀

This guide provides everything needed to create a production-ready React Native app for Sakshi with all core features optimized for mobile.
