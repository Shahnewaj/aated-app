import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUpdatePasswordMutation } from '../lib/services/ProfileApi';
import Toast from 'react-native-simple-toast';

const ChangePasswordScreen = ({ navigation }: any) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleUpdate = async () => {
    if (!password) {
      Toast.show('Please enter a new password', Toast.SHORT);
      return;
    }
    if (password.length < 6) {
      Toast.show('Password must be at least 6 characters', Toast.SHORT);
      return;
    }
    if (password !== confirmPassword) {
      Toast.show('Passwords do not match', Toast.SHORT);
      return;
    }

    try {
      await updatePassword({ password }).unwrap();
      Toast.show('Password updated successfully!', Toast.SHORT);
      navigation.goBack();
    } catch (err: any) {
      Toast.show(err?.data?.message || 'Failed to update password', Toast.LONG);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <LinearGradient
        colors={['#0A0E27', '#111636', '#1A1F45']}
        style={styles.bg}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                placeholderTextColor="#5A6080"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#8892B0"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#5A6080"
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.updateBtn}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#4F63FF', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Update Password</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1, backgroundColor: '#0A0E27' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { padding: 20, marginTop: 20 },
  fieldGroup: { marginBottom: 25 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8892B0',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161B3A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2A3060',
    paddingHorizontal: 15,
    height: 56,
  },
  input: { flex: 1, color: '#E8ECF4', fontSize: 16 },
  eyeBtn: { padding: 5 },
  updateBtn: { marginTop: 10 },
  btnGradient: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default ChangePasswordScreen;
