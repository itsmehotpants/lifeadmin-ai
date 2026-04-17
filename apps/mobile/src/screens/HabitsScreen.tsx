import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { Flame, Plus, Target } from 'lucide-react-native';

export default function HabitsScreen() {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/habits');
      setHabits(data.data);
    } catch (error) {
      console.error("Failed to load habits", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const toggleComplete = async (habitId: string) => {
    try {
      await api.post(`/habits/${habitId}/log`);
      fetchHabits();
    } catch (error) {
      console.error("Failed to log habit", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            <Target color={COLORS.primary} size={24} /> Habits
          </Text>
          <Text style={styles.subtitle}>Build consistency.</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus color="white" size={20} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.list}>
          {habits.map((habit: any) => (
            <TouchableOpacity 
              key={habit.id} 
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => toggleComplete(habit.id)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Text style={{ fontSize: 24 }}>{habit.completedToday ? '✅' : '🎯'}</Text>
                </View>
                <View style={styles.habitMeta}>
                  <Text style={styles.habitTitle}>{habit.name}</Text>
                  <Text style={styles.habitFrequency}>{habit.frequency}</Text>
                </View>
                
                <View style={styles.streakBox}>
                   <Flame color={COLORS.primary} size={20} />
                   <Text style={styles.streakText}>{habit.currentStreak}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.statLabel}>Longest: <Text style={styles.statValue}>{habit.longestStreak}</Text></Text>
              </View>
            </TouchableOpacity>
          ))}

          {habits.length === 0 && (
            <View style={styles.emptyState}>
              <Target color={COLORS.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>No Habits</Text>
              <Text style={styles.emptySubtitle}>Start building consistency today!</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SIZES.padding, paddingTop: 60, backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4, },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: SIZES.radius, },
  addButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 4, },
  list: { padding: SIZES.padding, },
  card: {
    backgroundColor: COLORS.card, padding: 16, borderRadius: SIZES.radius,
    marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', },
  iconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  habitMeta: { flex: 1 },
  habitTitle: { fontSize: 16, color: COLORS.text, fontWeight: '600' },
  habitFrequency: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  streakBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(99,102,241,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: SIZES.radius },
  streakText: { color: COLORS.primary, fontWeight: 'bold', marginLeft: 4, fontSize: 16 },
  statsRow: { marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { color: COLORS.textSecondary, fontSize: 12 },
  statValue: { color: COLORS.text, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 16 },
  emptySubtitle: { color: COLORS.textSecondary, marginTop: 8 }
});
