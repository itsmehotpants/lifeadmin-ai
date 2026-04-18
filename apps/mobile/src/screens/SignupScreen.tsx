import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore, api } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { Brain } from 'lucide-react-native';

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { name, email, password });
      await login(email, password); // Auto-login on success
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconBox}>
          <Brain color="white" size={32} />
        </View>
        <Text style={styles.title}>Join LifeAdmin <Text style={styles.titleHighlight}>AI</Text></Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input} 
          placeholderTextColor={COLORS.textSecondary}
          placeholder="John Doe" 
          value={name} 
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholderTextColor={COLORS.textSecondary}
          placeholder="you@example.com" 
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholderTextColor={COLORS.textSecondary}
          placeholder="Create password" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading || !name || !email || !password}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: COLORS.textSecondary }}>
            Already have an account? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: SIZES.padding },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  iconBox: { backgroundColor: COLORS.primary, padding: 12, borderRadius: SIZES.radius, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  titleHighlight: { color: COLORS.primary },
  card: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  label: { color: COLORS.textSecondary, marginBottom: 8, fontSize: 14 },
  input: { backgroundColor: '#1a1a26', borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 14, color: COLORS.text, marginBottom: 16 },
  button: { backgroundColor: COLORS.primary, padding: 16, borderRadius: SIZES.radius, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: COLORS.danger, marginBottom: 12 }
});
