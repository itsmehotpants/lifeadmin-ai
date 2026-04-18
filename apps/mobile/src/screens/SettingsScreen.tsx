import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { LogOut, User, Bell, Shield, ChevronRight, HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.profileCard}>
           <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || "U"}</Text>
           </View>
           <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || "User"}</Text>
              <Text style={styles.userEmail}>{user?.email || ""}</Text>
              <View style={styles.planBadge}>
                <Text style={styles.planText}>{user?.subscriptionPlan || "FREE"} PLAN</Text>
              </View>
           </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      <View style={styles.card}>
        <SettingsItem icon={<User size={20} color={COLORS.primary} />} label="Edit Profile" />
        <SettingsItem icon={<Bell size={20} color="#f59e0b" />} label="Notifications" />
        <SettingsItem icon={<Shield size={20} color="#10b981" />} label="Privacy & Security" />
      </View>

      <Text style={styles.sectionLabel}>SUPPORT</Text>
      <View style={styles.card}>
        <SettingsItem icon={<HelpCircle size={20} color={COLORS.textSecondary} />} label="Help Center" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut color={COLORS.danger} size={20} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>LifeAdmin AI v1.0.0 (Beta)</Text>
    </ScrollView>
  );
}

function SettingsItem({ icon, label }: { icon: any, label: string }) {
  return (
    <TouchableOpacity style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <ChevronRight size={16} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SIZES.padding, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  section: { padding: SIZES.padding },
  profileCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, 
    padding: 20, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border 
  },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  profileInfo: { marginLeft: 16, flex: 1 },
  userName: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  userEmail: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  planBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(99, 102, 241, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  planText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
  sectionLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: 'bold', marginLeft: 20, marginBottom: 8, marginTop: 12 },
  card: { backgroundColor: COLORS.card, marginHorizontal: SIZES.padding, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 32, alignItems: 'center' },
  itemLabel: { color: COLORS.text, fontSize: 14, marginLeft: 12 },
  logoutButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginHorizontal: SIZES.padding, marginTop: 40, padding: 16, borderRadius: SIZES.radius,
    backgroundColor: 'rgba(239, 68, 68, 0.05)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.1)' 
  },
  logoutText: { color: COLORS.danger, fontWeight: 'bold', fontSize: 16 },
  versionText: { textAlign: 'center', color: COLORS.textSecondary, fontSize: 10, marginTop: 24, marginBottom: 40 },
});
