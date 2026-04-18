import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, ActivityIndicator, Alert, Clipboard 
} from 'react-native';
import { api } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { Users, UserPlus, Shield, Copy, Trash2, CheckCircle } from 'lucide-react-native';

export default function FamilyScreen() {
  const [family, setFamily] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [error, setError] = useState("");

  const fetchFamily = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/family/members');
      if (data.success) {
        setFamily(data.data.id ? data.data : null);
      }
    } catch (error) {
      console.error("Failed to load family", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  const handleCreate = async () => {
    if (!familyName) return;
    try {
      const { data } = await api.post('/family/create', { name: familyName });
      if (data.success) {
        setFamily(data.data);
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.error || "Failed to create family");
    }
  };

  const handleJoin = async () => {
    if (!inviteCode) return;
    try {
      const { data } = await api.post('/family/join', { inviteCode });
      if (data.success) {
        fetchFamily();
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.error || "Invalid invite code");
    }
  };

  const copyCode = () => {
    if (family?.inviteCode) {
      Clipboard.setString(family.inviteCode);
      Alert.alert("Copied", "Invite code copied to clipboard");
    }
  };

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator color={COLORS.primary} size="large" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Family Studio</Text>
        <Text style={styles.subtitle}>Collaborate with your household</Text>
      </View>

      {!family ? (
        <View style={styles.padding}>
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Shield color={COLORS.primary} size={24} />
            </View>
            <Text style={styles.cardTitle}>Create Family Group</Text>
            <Text style={styles.cardSubtitle}>Start a new group and invite members</Text>
            <TextInput
              style={styles.input}
              placeholder="Family Name"
              placeholderTextColor={COLORS.textSecondary}
              value={familyName}
              onChangeText={setFamilyName}
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handleCreate}>
              <Text style={styles.buttonText}>Create Group</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { marginTop: 20 }]}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <UserPlus color={COLORS.success} size={24} />
            </View>
            <Text style={styles.cardTitle}>Join Existing Family</Text>
            <TextInput
              style={styles.input}
              placeholder="Invite Code"
              placeholderTextColor={COLORS.textSecondary}
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.secondaryButton} onPress={handleJoin}>
              <Text style={styles.secondaryButtonText}>Join with Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.padding}>
          <View style={styles.inviteCard}>
            <Text style={styles.inviteLabel}>INVITATION CODE</Text>
            <View style={styles.codeRow}>
              <Text style={styles.codeText}>{family.inviteCode}</Text>
              <TouchableOpacity onPress={copyCode} style={styles.copyBtn}>
                <Copy color="white" size={18} />
              </TouchableOpacity>
            </View>
            <Text style={styles.inviteHint}>Share this code with your family members</Text>
          </View>

          <View style={styles.membersCard}>
            <View style={styles.cardHeader}>
              <Users color={COLORS.primary} size={18} />
              <Text style={styles.sectionTitle}>{family.name}</Text>
            </View>
            {family.members.map((member: any) => (
              <View key={member.id} style={styles.memberItem}>
                <View style={styles.avatar}>
                   <Text style={styles.avatarText}>{member.user?.name?.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.user?.name} {member.role === 'owner' && "👑"}</Text>
                  <Text style={styles.memberEmail}>{member.user?.email}</Text>
                </View>
                {member.role === 'owner' && <Shield color={COLORS.warning} size={14} />}
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { padding: SIZES.padding, paddingTop: 60, backgroundColor: COLORS.card },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  subtitle: { color: COLORS.textSecondary, marginTop: 4 },
  padding: { padding: SIZES.padding },
  card: { backgroundColor: COLORS.card, padding: 20, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  cardSubtitle: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 16 },
  input: { 
    height: 50, backgroundColor: '#000', borderRadius: 12, paddingHorizontal: 16, 
    color: COLORS.text, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border 
  },
  primaryButton: { backgroundColor: COLORS.primary, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { backgroundColor: 'transparent', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary },
  secondaryButtonText: { color: COLORS.primary, fontWeight: 'bold' },
  inviteCard: { backgroundColor: '#1e1b4b', padding: 20, borderRadius: 16, marginBottom: 20 },
  inviteLabel: { color: '#818cf8', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  codeText: { color: 'white', fontSize: 28, fontWeight: 'bold', letterSpacing: 4 },
  copyBtn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 12 },
  inviteHint: { color: '#a5b4fc', fontSize: 12, marginTop: 12 },
  membersCard: { backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  memberItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: 'white', fontWeight: 'bold' },
  memberInfo: { flex: 1 },
  memberName: { color: COLORS.text, fontWeight: 'bold', fontSize: 14 },
  memberEmail: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 }
});
