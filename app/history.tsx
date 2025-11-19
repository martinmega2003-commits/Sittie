import { StyleSheet, Text, View } from 'react-native';

export default function History() {
  const history = [
    { from: 'Hodonín', to: 'Brno' },
    { from: 'Praha', to: 'Ostrava' },
    { from: 'Zlín', to: 'Olomouc' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Historie vyhledávání</Text>

      <View style={styles.list}>
        {history.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyFrom}>{item.from}</Text>
            <Text style={styles.historyArrow}>→</Text>
            <Text style={styles.historyTo}>{item.to}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: '#f3f4f6',
    marginTop: 100,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
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
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  historyFrom: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  historyArrow: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  historyTo: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
});
