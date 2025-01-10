import Navigation from './navigations';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Asset } from 'expo-asset';
import { UserProvider } from './contexts/UserContext';

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Asset.fromModule(
          require('../assets/start_icon.png')
        ).downloadAsync();
        await Asset.fromModule(
          require('../assets/Crople_Text3.png')
        ).downloadAsync();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const onReady = async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <UserProvider>
      <View style={{ flex: 1 }} onLayout={onReady}>
        <StatusBar style={'dark'} />
        <Navigation />
      </View>
    </UserProvider>
  );
};

export default App;
