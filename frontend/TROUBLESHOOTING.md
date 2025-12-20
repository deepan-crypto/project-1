# Fix LinearGradient Error

## Quick Solution

1. **Stop your current Expo server** (Ctrl+C in the terminal)

2. **Restart with cache clear:**
   ```bash
   cd /home/edith/Documents/project-1/frontend
   npx expo start --clear
   ```

3. **Press 'r' to reload** when the QR code appears

## If Problem Persists

The expo-linear-gradient package has been reinstalled. If you still see the error:

1. **Clear all cache:**
   ```bash
   cd /home/edith/Documents/project-1/frontend
   rm -rf node_modules
   rm package-lock.json
   npm install
   npx expo start --clear
   ```

2. **For iOS:** If using iOS simulator, run:
   ```bash
   cd ios && pod install && cd ..
   ```

3. **For Android:** If using Android, clear build:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

## Temporary Workaround

If you want to test validation without fixing the gradient immediately, replace the LinearGradient in signup.tsx:

```typescript
// Comment out:
// <LinearGradient colors={['#45BFD0', '#2B9EB3']} style={styles.container}>

// Replace with:
<View style={[styles.container, { backgroundColor: '#45BFD0' }]}>
```

Don't forget to also update the closing tag from `</LinearGradient>` to `</View>`

**The validation features will work fine with either option!**
