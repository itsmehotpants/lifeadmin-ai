import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { COLORS, SIZES } from '../theme';
import { Brain } from 'lucide-react-native';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('naman@example.com');
  const [password, setPassword] = useState('Password123');
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
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
        <Text style={styles.title}>LifeAdmin <Text style={styles.titleHighlight}>AI</Text></Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholderTextColor={COLORS.textSecondary}
          placeholder="you@example.com" 
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholderTextColor={COLORS.textSecondary}
          placeholder="Enter password" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Log in</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: COLORS.textSecondary }}>
            Need an account? <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBox: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  titleHighlight: {
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1a1a26',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 14,
    color: COLORS.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: COLORS.danger,
    marginBottom: 12,
  }
});
