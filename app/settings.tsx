import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../components/theme';

export default function Settings() {
  const [clearingHistory, setClearingHistory] = useState(false);
  const { theme, colors, toggle } = useTheme();
  const isDark = theme === 'dark';
  const [warning, setWarning] = useState(false);
  const [accept, setAccept] = useState(false);

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



const date = new Date(); // nebo new Date("2025-11-12")

const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0");
const year = date.getFullYear();

const formatted = `${day}.${month}.${year}`;
console.log(formatted);

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
        onPress={() => setWarning(true)}>
        <Text style={[styles.buttonText, { color: colors.card }]}>
          {clearingHistory ? 'Mažu...' : 'Smazat historii'}
        </Text>
      </Pressable>

      {warning && (
        <View style={styles.warningOverlay}>
          <View style={[styles.warningCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.warningText, { color: colors.text }]}>
              Jsi si jisty
            </Text>
            <View style={styles.warningActions}>
              <Pressable style={[styles.warningButton, styles.warningYes]} onPress={() => {setAccept(true);
                cleaningHistory();
                setWarning(false);
              }}>
                <Text style={styles.warningButtonText}> Ano </Text>
              </Pressable>
              <Pressable style={[styles.warningButton, styles.warningNo]} onPress={() => {setAccept(false);
                setWarning(false);
              }}>
                <Text style={styles.warningButtonText}> Ne </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    

      {
      accept && (
        <View>
          <Text>
            Historie byla smazana {formatted}
          </Text>
        </View>
      )}


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
  warningOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  warningCard: {
    width: '100%',
    maxWidth: 320,
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#fff',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  warningOption: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  warningConfirm: {
    backgroundColor: '#e53935',
  },
  warningCancel: {
    backgroundColor: '#37474f',
  },
  warningOptionText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  warningActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 4,
  },
  warningButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  warningYes: {
    backgroundColor: '#e53935',
  },
  warningNo: {
    backgroundColor: '#546e7a',
  },
  warningButtonText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
