import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { Target, ChevronRight, Calendar, Flag } from 'lucide-react-native';

const categoryColors: Record<string, string> = {
  WORK: "#6366f1", FINANCE: "#f59e0b", HEALTH: "#10b981", PERSONAL: "#ec4899", EDUCATION: "#8b5cf6",
};

export default function GoalsScreen() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/goals');
      setGoals(data.data);
    } catch (error) {
      console.error("Failed to load goals", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            <Target color={COLORS.primary} size={24} /> Goals
          </Text>
          <Text style={styles.subtitle}>Manifest your future.</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.list}>
          {goals.map((goal: any) => (
            <TouchableOpacity key={goal.id} style={styles.card} activeOpacity={0.8}>
              <View style={styles.cardHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: `${categoryColors[goal.category] || COLORS.primary}15` }]}>
                  <Text style={[styles.categoryText, { color: categoryColors[goal.category] || COLORS.primary }]}>{goal.category}</Text>
                </View>
                <View style={styles.dateInfo}>
                  <Calendar size={12} color={COLORS.textSecondary} />
                  <Text style={styles.dateText}>{new Date(goal.targetDate).toLocaleDateString()}</Text>
                </View>
              </View>

              <Text style={styles.goalTitle}>{goal.title}</Text>
              
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressValue}>{goal.progressPercent}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${goal.progressPercent}%` }]} />
                </View>
              </View>

              {goal.milestones && (
                <View style={styles.milestoneMini}>
                  <Flag size={12} color={COLORS.textSecondary} />
                  <Text style={styles.milestoneText}>
                    {Array.isArray(goal.milestones) ? goal.milestones.length : 0} milestones
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {goals.length === 0 && (
            <View style={styles.emptyState}>
              <Target color={COLORS.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>No Goals Set</Text>
              <Text style={styles.emptySubtitle}>Dream big and start tracking.</Text>
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
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  addButton: { 
    backgroundColor: 'rgba(99, 102, 241, 0.1)', 
    paddingHorizontal: 16, paddingVertical: 8, 
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.2)' 
  },
  addButtonText: { color: COLORS.primary, fontWeight: 'bold' },
  list: { padding: SIZES.padding },
  card: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { fontSize: 10, fontWeight: 'bold' },
  dateInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 11, color: COLORS.textSecondary },
  goalTitle: { fontSize: 18, color: COLORS.text, fontWeight: 'bold', marginBottom: 16 },
  progressSection: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: COLORS.textSecondary },
  progressValue: { fontSize: 12, color: COLORS.text, fontWeight: 'bold' },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  milestoneMini: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, opacity: 0.6 },
  milestoneText: { fontSize: 11, color: COLORS.textSecondary },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 16 },
  emptySubtitle: { color: COLORS.textSecondary, marginTop: 8 },
});
