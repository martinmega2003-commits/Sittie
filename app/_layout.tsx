import { ThemeProvider } from '@/components/theme';
import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {
  return (
    <ThemeProvider>
    <Drawer screenOptions={{ headerTransparent: true, headerTitle: '' }}>
      <Drawer.Screen name="index" options={{ title: 'Domů' }} />
      <Drawer.Screen name="settings" options={{ title: 'Nastavení' }} />
      <Drawer.Screen name="history" options={{ title: 'Historie' }} />
    </Drawer>
    </ThemeProvider>
  );
}
