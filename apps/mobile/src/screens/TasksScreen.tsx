import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { CheckSquare, Plus, AlertTriangle, Calendar } from 'lucide-react-native';

const priorityColors: Record<string, string> = {
  LOW: "#64748b", MEDIUM: "#3b82f6", HIGH: "#f59e0b", CRITICAL: "#ef4444",
};

const categoryColors: Record<string, string> = {
  FINANCE: "#f59e0b", HEALTH: "#10b981", WORK: "#6366f1", PERSONAL: "#ec4899",
  EDUCATION: "#8b5cf6", SOCIAL: "#14b8a6", HOME: "#f97316", OTHER: "#64748b",
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleComplete = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      fetchTasks();
    } catch (error) {
      console.error("Failed to complete task", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            <CheckSquare color={COLORS.primary} size={24} /> Tasks
          </Text>
          <Text style={styles.subtitle}>{tasks.length} total tasks</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus color="white" size={20} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.taskList}>
          {tasks.map((task: any) => (
            <TouchableOpacity 
              key={task.id} 
              style={[styles.taskCard, task.status === 'COMPLETED' && styles.taskCardCompleted]}
              activeOpacity={0.7}
            >
              <TouchableOpacity 
                style={[
                  styles.checkbox, 
                  { borderColor: task.status === 'COMPLETED' ? COLORS.success : priorityColors[task.priority] },
                  task.status === 'COMPLETED' && { backgroundColor: COLORS.success }
                ]}
                onPress={() => toggleComplete(task.id)}
              />
              
              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, task.status === 'COMPLETED' && styles.taskTitleCompleted]}>
                  {task.title}
                </Text>
                {task.consequenceText && task.status !== 'COMPLETED' && (
                  <View style={styles.warningBox}>
                    <AlertTriangle color={COLORS.warning} size={12} />
                    <Text style={styles.warningText}>{task.consequenceText}</Text>
                  </View>
                )}
              </View>

              <View style={[styles.badge, { backgroundColor: `${categoryColors[task.category]}15` }]}>
                <Text style={[styles.badgeText, { color: categoryColors[task.category] }]}>{task.category}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {tasks.length === 0 && (
            <View style={styles.emptyState}>
              <CheckSquare color={COLORS.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>No tasks found</Text>
              <Text style={styles.emptySubtitle}>Try adding a new task!</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: 60, // Safe area equivalent
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  taskList: {
    padding: SIZES.padding,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 16,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  warningText: {
    color: COLORS.warning,
    fontSize: 12,
    marginLeft: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    marginTop: 8,
  }
});
