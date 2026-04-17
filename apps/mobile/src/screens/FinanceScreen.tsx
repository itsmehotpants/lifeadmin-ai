import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { CreditCard, Plus, IndianRupee, AlertTriangle } from 'lucide-react-native';

const typeColors: Record<string, string> = {
  BILL: "#f59e0b", SUBSCRIPTION: "#8b5cf6", LOAN_EMI: "#ef4444", INSURANCE: "#3b82f6", INVESTMENT: "#10b981", INCOME: "#22c55e", CUSTOM: "#64748b",
};

export default function FinanceScreen() {
  const [finances, setFinances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFinances = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/finance');
      setFinances(data.data);
    } catch (error) {
      console.error("Failed to load finance data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinances();
  }, []);
  
  const unpaid = finances.filter((f: any) => !f.isPaid);
  const urgent = unpaid.filter((f: any) => f.daysUntilDue <= 3 && f.daysUntilDue >= 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            <CreditCard color={COLORS.warning} size={24} /> Finance
          </Text>
          <Text style={styles.subtitle}>Track your cash flow.</Text>
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
          
          {urgent.length > 0 && (
             <View style={styles.urgentAlert}>
                <AlertTriangle color={COLORS.warning} size={16} />
                <Text style={styles.urgentText}>{urgent.length} payment(s) due within 3 days!</Text>
             </View>
          )}

          {finances.map((item: any) => (
            <View 
              key={item.id} 
              style={[styles.card, item.isPaid && { opacity: 0.5 }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.meta}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemDue}>Due on the {item.dueDay}th</Text>
                </View>
                
                <View style={{alignItems: 'flex-end'}}>
                   <View style={styles.amountBox}>
                      <IndianRupee color={COLORS.text} size={14} />
                      <Text style={styles.amountText}>{item.amount}</Text>
                   </View>
                   <View style={[styles.badge, { backgroundColor: `${typeColors[item.type]}15` }]}>
                     <Text style={[styles.badgeText, { color: typeColors[item.type] }]}>{item.type.replace('_', ' ')}</Text>
                   </View>
                </View>
              </View>
            </View>
          ))}

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
  urgentAlert: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: SIZES.radius, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  urgentText: { color: COLORS.warning, fontWeight: 'bold', marginLeft: 8 },
  card: { backgroundColor: COLORS.card, padding: 16, borderRadius: SIZES.radius, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'},
  meta: { flex: 1, marginRight: 12 },
  itemTitle: { fontSize: 16, color: COLORS.text, fontWeight: '600' },
  itemDue: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  amountBox: { flexDirection: 'row', alignItems: 'center' },
  amountText: { color: COLORS.text, fontWeight: 'bold', fontSize: 16 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 6, alignSelf: 'flex-end'},
  badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'capitalize' },
});
