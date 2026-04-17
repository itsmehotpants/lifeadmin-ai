import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore, api } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { LayoutDashboard, Target, Activity, Flame } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch today's tasks
    api.get('/tasks/today').then(({data}) => setTasks(data.data)).catch(console.error);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0] || 'User'}! 👋</Text>
        <Text style={styles.subtitle}>Here's your life at a glance.</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <LayoutDashboard color={COLORS.primary} size={24} />
          <Text style={styles.statValue}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Tasks Today</Text>
        </View>
        <View style={styles.statBox}>
          <Activity color={COLORS.success} size={24} />
          <Text style={styles.statValue}>76</Text>
          <Text style={styles.statLabel}>Discipline</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Today's Action Items</Text>
      {tasks.length > 0 ? tasks.map((task: any) => (
        <TouchableOpacity key={task.id} style={styles.card}>
          <View style={[styles.priorityDot, { backgroundColor: task.priority === 'CRITICAL' ? COLORS.danger : COLORS.primary }]} />
          <View style={styles.cardContent}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.consequenceText && <Text style={styles.taskWarning}>{task.consequenceText}</Text>}
          </View>
        </TouchableOpacity>
      )) : (
        <View style={styles.card}>
          <Text style={styles.taskTitle}>All caught up! 🎉</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Habits</Text>
      <View style={styles.card}>
        <View style={styles.habitRow}>
           <Text style={{fontSize: 24}}>💪</Text>
           <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.taskTitle}>Gym</Text>
              <Text style={styles.statLabel}>8 days streak</Text>
           </View>
           <Flame color={COLORS.primary} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 8,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  taskTitle: {
    color: COLORS.text,
    fontWeight: '500',
  },
  taskWarning: {
    color: COLORS.warning,
    fontSize: 12,
    marginTop: 2,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  }
});
