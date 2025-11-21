import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../components/theme';

export default function History() {
  const [history, setHistory] = useState<Array<{ from: string; to: string; timestamp: number }>>([]);
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadHistory = async () => {
        try {
          const stored = await AsyncStorage.getItem('@history');
          if (!isActive) return;

          if (stored) {
            setHistory(JSON.parse(stored));
          } else {
            setHistory([]);
          }
        } catch (err) {
          console.error('load error', err);
        }
      };

      loadHistory();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Text style={[styles.heading, { color: colors.text }]}>
        Historie vyhledávání
      </Text>

      <View style={styles.list}>
        {history.map((item, index) => (
          <View
            key={index}
            style={[
              styles.historyItem,
              {
                backgroundColor: colors.card,
                shadowColor: '#000', 
              },
            ]}
          >
            <Text
              style={[
                styles.historyFrom,
                { color: colors.text },
              ]}
            >
              {item.from}
            </Text>
            <Text
              style={[
                styles.historyArrow,
                { color: colors.muted },
              ]}
            >
              →
            </Text>
            <Text
              style={[
                styles.historyTo,
                { color: colors.text },
              ]}
            >
              {item.to}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 100,   
    gap: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  historyFrom: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  historyArrow: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  historyTo: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '500',
  },
});
