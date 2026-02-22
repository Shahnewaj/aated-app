import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSigninMutation } from '../lib/services/UserApi';
import { useAppDispatch } from '../lib/store/hooks';
import { appSetUser } from '../lib/store/features/UserSlice';
import { RouteMap } from '../navigation/RouteMap';
import Toast from 'react-native-simple-toast';

const SigninScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const [signin, { isLoading }] = useSigninMutation();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim())
      newErrors.username = 'Email or username is required';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignin = async () => {
    if (!validate()) return;
    try {
      const result = await signin({
        username: form.username.trim(),
        password: form.password,
      }).unwrap();

      // Store access + refresh tokens and user info
      dispatch(appSetUser(result));
      Toast.show('Welcome back!', Toast.SHORT);
    } catch (err: any) {
      const errData = err?.data;
      if (errData && typeof errData === 'object') {
        const fieldErrors: Record<string, string> = {};
        Object.keys(errData).forEach(key => {
          const val = errData[key];
          fieldErrors[key] = Array.isArray(val) ? val[0] : String(val);
        });
        setErrors(fieldErrors);

        const detail =
          errData.detail ||
          errData.message ||
          'Invalid credentials. Please try again.';
        Toast.show(detail, Toast.LONG);
      } else {
        Toast.show(
          err?.data?.detail ||
            err?.data?.message ||
            'Invalid credentials. Please try again.',
          Toast.LONG,
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <LinearGradient
        colors={['#0A0E27', '#111636', '#1A1F45']}
        style={styles.bg}
      />

      {/* Decorative blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#4F63FF', '#8B5CF6']}
              style={styles.logoCircle}
            >
              <Text style={styles.logoText}>A</Text>
            </LinearGradient>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your alumni account</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Username */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email / Username</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.username ? styles.inputError : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email or username"
                  placeholderTextColor="#5A6080"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.username}
                  onChangeText={v => setForm({ ...form, username: v })}
                />
              </View>
              {errors.username ? (
                <Text style={styles.errorText}>{errors.username}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password ? styles.inputError : null,
                ]}
              >
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter your password"
                  placeholderTextColor="#5A6080"
                  secureTextEntry={!showPassword}
                  value={form.password}
                  onChangeText={v => setForm({ ...form, password: v })}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(p => !p)}
                  style={styles.eyeBtn}
                >
                  <Text style={styles.eyeText}>
                    {showPassword ? '🙈' : '👁'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => navigation.navigate(RouteMap.ForgotPassword)}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#4F63FF', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Don't have an account?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Go to Signup */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate(RouteMap.Signup)}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryBtnText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Alumni Association of DUET — Gazipur
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SigninScreen;

const CARD_RADIUS = 24;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  blob1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#4F63FF22',
    top: -60,
    right: -80,
  },
  blob2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#7C3AED15',
    bottom: 80,
    left: -60,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: 36,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4F63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#8892B0',
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: '#161B3A',
    borderRadius: CARD_RADIUS,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A3060',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8892B0',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1130',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#2A3060',
    paddingHorizontal: 16,
    height: 52,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    color: '#E8ECF4',
    fontSize: 15,
  },
  eyeBtn: {
    paddingLeft: 10,
    paddingVertical: 4,
  },
  eyeText: { fontSize: 18 },
  errorText: {
    marginTop: 5,
    fontSize: 12,
    color: '#EF4444',
  },
  submitBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#4F63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A3060',
  },
  dividerText: {
    color: '#5A6080',
    fontSize: 13,
    flexShrink: 1,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    marginTop: -4,
    paddingVertical: 4,
  },
  forgotText: {
    color: '#4F63FF',
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#4F63FF',
  },
  secondaryBtnText: {
    color: '#4F63FF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    textAlign: 'center',
    color: '#3A4060',
    fontSize: 12,
    marginTop: 28,
    letterSpacing: 0.3,
  },
});
