import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { api } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { BarChart3, TrendingUp, Zap, Brain } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/analytics/dashboard');
      setAnalytics(data.data);
    } catch (error) {
      console.error("Failed to load analytics", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const weeklyData = analytics?.weeklyData || [];
  const maxTotal = Math.max(...weeklyData.map((d: any) => d.total), 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          <BarChart3 color={COLORS.primary} size={24} /> Analytics
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{analytics?.completionRate || 0}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{analytics?.tasksCompleted || 0}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Weekly Productivity</Text>
          <View style={styles.barChart}>
            {weeklyData.map((day: any, i: number) => (
              <View key={i} style={styles.barContainer}>
                <View style={styles.barColumn}>
                  <View style={[styles.barBg, { height: 100 }]}>
                    <View style={[styles.barFill, { height: (day.completed / maxTotal) * 100 }]} />
                  </View>
                </View>
                <Text style={styles.barLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.disciplineSection}>
          <Text style={styles.sectionTitle}>Discipline Trend</Text>
          <View style={styles.trendRow}>
            {(analytics?.disciplineScores || []).map((score: number, i: number) => (
              <View key={i} style={styles.trendDotContainer}>
                <View style={[styles.trendBar, { height: (score / 100) * 60, backgroundColor: COLORS.primary }]} />
                <Text style={styles.trendValue}>{score}</Text>
                <Text style={styles.trendLabel}>W{i+1}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.insightCard, { marginTop: 20 }]}>
          <Brain color={COLORS.primary} size={20} />
          <View style={styles.insightTextContent}>
            <Text style={styles.insightTitle}>AI Peak Insight</Text>
            <Text style={styles.insightBody}>
              Your peak productive day is {analytics?.peakDay || 'Unknown'}. Plan your hardest tasks accordingly.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: SIZES.padding, paddingTop: 60, backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  content: { padding: SIZES.padding },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { 
    flex: 1, backgroundColor: COLORS.card, padding: 16, borderRadius: SIZES.radius,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center'
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, textTransform: 'uppercase' },
  chartSection: { backgroundColor: COLORS.card, padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 130 },
  barContainer: { alignItems: 'center', flex: 1 },
  barColumn: { width: 12, alignItems: 'center' },
  barBg: { width: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, justifyContent: 'flex-end' },
  barFill: { width: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
  barLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 8 },
  disciplineSection: { backgroundColor: COLORS.card, padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border },
  trendRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 80, marginTop: 10 },
  trendDotContainer: { alignItems: 'center' },
  trendBar: { width: 20, borderRadius: 4, opacity: 0.8 },
  trendValue: { fontSize: 10, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  trendLabel: { fontSize: 8, color: COLORS.textSecondary, marginTop: 2 },
  insightCard: { 
    flexDirection: 'row', gap: 12, backgroundColor: 'rgba(99, 102, 241, 0.05)', 
    padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.1)' 
  },
  insightTextContent: { flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  insightBody: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
});
