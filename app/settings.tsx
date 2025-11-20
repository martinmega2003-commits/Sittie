import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../components/theme';

export default function Settings() {
  const [clearingHistory, setClearingHistory] = useState(false);
  const { theme, colors, toggle } = useTheme();
  const isDark = theme === 'dark';

  async function cleaningHistory() {
    try {
      setClearingHistory(true);
      await AsyncStorage.removeItem('@history');
    } catch (err) {
      console.error(err);
    } finally {
      setClearingHistory(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Nastavení</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View>
          <Text style={[styles.label, { color: colors.text }]}>Dark mode</Text>
          <Text style={[styles.caption, { color: colors.muted }]}>
            Přepnout vzhled aplikace
          </Text>
        </View>
        <Switch value={isDark} onValueChange={toggle} />
      </View>

      <Pressable
        style={[
          styles.button,
          { backgroundColor: colors.primary },
          clearingHistory && styles.buttonDisabled,
        ]}
        onPress={cleaningHistory}
        disabled={clearingHistory}
      >
        <Text style={[styles.buttonText, { color: colors.card }]}>
          {clearingHistory ? 'Mažu...' : 'Smazat historii'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  heading: {
    marginTop: 72,
    fontSize: 22,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  caption: {
    marginTop: 4,
    fontSize: 13,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
