import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthStore, api } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { LayoutDashboard, Activity, Flame, Sparkles, Send } from 'lucide-react-native';
import { TextInput, ActivityIndicator } from 'react-native';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const fetchTasks = () => {
    api.get('/tasks/today').then(({data}) => setTasks(data.data)).catch(console.error);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAIParse = async () => {
    if (!aiInput.trim()) return;
    setIsParsing(true);
    try {
      const { data } = await api.post('/ai/parse-task', { input: aiInput });
      await api.post('/tasks', data.data);
      setAiInput("");
      fetchTasks();
    } catch (err) {
      console.error("AI Parse failed", err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0] || 'User'}! 👋</Text>
        <Text style={styles.subtitle}>Here's your life at a glance.</Text>
      </View>

      <View style={styles.aiBar}>
        <Sparkles color={COLORS.primary} size={20} />
        <TextInput
          style={styles.aiInput}
          placeholder="I need to pay rent tomorrow..."
          placeholderTextColor={COLORS.textSecondary}
          value={aiInput}
          onChangeText={setAiInput}
          disabled={isParsing}
        />
        <TouchableOpacity onPress={handleAIParse} disabled={isParsing || !aiInput.trim()}>
          {isParsing ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Send color={COLORS.primary} size={20} />}
        </TouchableOpacity>
      </View>

      <View style={styles.quickLinks}>
        <TouchableOpacity 
          style={[styles.linkCard, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}
          onPress={() => (navigation as any).navigate('Goals')}
        >
          <Target color={COLORS.primary} size={20} />
          <Text style={styles.linkText}>Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.linkCard, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}
          onPress={() => (navigation as any).navigate('Analytics')}
        >
          <Activity color={COLORS.success} size={20} />
          <Text style={styles.linkText}>Analytics</Text>
        </TouchableOpacity>
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
  aiBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aiInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  linkCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  linkText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
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
