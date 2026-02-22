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
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '../lib/services/UserApi';
import { RouteMap } from '../navigation/RouteMap';
import Toast from 'react-native-simple-toast';

const OTP_LENGTH = 6;

// Step 0: Enter Email
// Step 1: Enter OTP + New Password
const ForgotPasswordScreen = ({ navigation }: any) => {
  const [forgotPassword, { isLoading: isSending }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const [step, setStep] = useState<0 | 1>(0);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [otpValue, setOtpValue] = useState('');
  const otpRef = useBlurOnFulfill({ value: otpValue, cellCount: OTP_LENGTH });
  const [otpProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: setOtpValue,
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  // Step 0: Send OTP
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Please enter a valid email');
      return;
    }
    setEmailError('');
    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      Toast.show('OTP sent to your email!', Toast.SHORT);
      setStep(1);
    } catch (err: any) {
      const errData = err?.data;
      const detail =
        errData?.detail ||
        errData?.email?.[0] ||
        errData?.message ||
        'Failed to send OTP.';
      Toast.show(detail, Toast.LONG);
    }
  };

  // Step 1: Reset password
  const handleResetPassword = async () => {
    let valid = true;
    if (otpValue.length < OTP_LENGTH) {
      Toast.show('Please enter the full 6-digit OTP', Toast.SHORT);
      return;
    }
    if (!newPassword) {
      setPasswordError('New password is required');
      valid = false;
    } else if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    if (newPassword !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    } else {
      setConfirmError('');
    }
    if (!valid) return;

    try {
      await resetPassword({
        email: email.trim(),
        otp: otpValue,
        password: newPassword,
      }).unwrap();
      Toast.show('Password reset successfully! Please sign in.', Toast.LONG);
      navigation.navigate(RouteMap.Signin);
    } catch (err: any) {
      const errData = err?.data;
      if (errData && typeof errData === 'object') {
        // Map field errors if any
        if (errData.otp)
          Toast.show(
            Array.isArray(errData.otp) ? errData.otp[0] : String(errData.otp),
            Toast.LONG,
          );
        else if (errData.password)
          setPasswordError(
            Array.isArray(errData.password)
              ? errData.password[0]
              : String(errData.password),
          );

        const detail =
          errData.detail ||
          errData.message ||
          'Invalid OTP or request expired.';
        Toast.show(detail, Toast.LONG);
      } else {
        Toast.show('Reset failed. Please try again.', Toast.LONG);
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
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => (step === 1 ? setStep(0) : navigation.goBack())}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>
              {step === 1 ? 'Back' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#4F63FF', '#8B5CF6']}
              style={styles.logoCircle}
            >
              <Text style={styles.logoText}>A</Text>
            </LinearGradient>
            <Text style={styles.title}>
              {step === 0 ? 'Forgot Password' : 'Reset Password'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 0
                ? 'Enter your registered email to receive a reset OTP'
                : `Enter the OTP sent to ${email}`}
            </Text>
          </View>

          {/* Step Indicator */}
          <View style={styles.stepRow}>
            {[0, 1].map(i => (
              <View key={i} style={styles.stepItem}>
                <LinearGradient
                  colors={
                    i <= step ? ['#4F63FF', '#7C3AED'] : ['#1E2347', '#1E2347']
                  }
                  style={styles.stepCircle}
                >
                  <Text style={styles.stepNum}>{i + 1}</Text>
                </LinearGradient>
                {i < 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      step > i ? styles.stepLineActive : null,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Card */}
          <View style={styles.card}>
            {step === 0 ? (
              /* ── STEP 0: Email ── */
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      emailError ? styles.inputError : null,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="your@email.com"
                      placeholderTextColor="#5A6080"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={v => {
                        setEmail(v);
                        setEmailError('');
                      }}
                    />
                  </View>
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  onPress={handleSendOtp}
                  disabled={isSending}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#4F63FF', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitBtn}
                  >
                    {isSending ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitBtnText}>Send OTP →</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              /* ── STEP 1: OTP + New Password ── */
              <>
                {/* OTP Input */}
                <Text style={styles.otpLabel}>Verification OTP</Text>
                <CodeField
                  ref={otpRef}
                  {...otpProps}
                  value={otpValue}
                  onChangeText={setOtpValue}
                  cellCount={OTP_LENGTH}
                  rootStyle={styles.otpRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={({ index, symbol, isFocused }) => (
                    <View
                      key={index}
                      style={[
                        styles.otpCell,
                        isFocused && styles.otpCellFocused,
                      ]}
                      onLayout={getCellOnLayoutHandler(index)}
                    >
                      <Text style={styles.otpCellText}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  )}
                />

                {/* New Password */}
                <View style={[styles.fieldGroup, { marginTop: 20 }]}>
                  <Text style={styles.label}>New Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      passwordError ? styles.inputError : null,
                    ]}
                  >
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Min. 6 characters"
                      placeholderTextColor="#5A6080"
                      secureTextEntry={!showPassword}
                      value={newPassword}
                      onChangeText={v => {
                        setNewPassword(v);
                        setPasswordError('');
                      }}
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
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                </View>

                {/* Confirm Password */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      confirmError ? styles.inputError : null,
                    ]}
                  >
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Re-enter new password"
                      placeholderTextColor="#5A6080"
                      secureTextEntry={!showPassword}
                      value={confirmPassword}
                      onChangeText={v => {
                        setConfirmPassword(v);
                        setConfirmError('');
                      }}
                    />
                  </View>
                  {confirmError ? (
                    <Text style={styles.errorText}>{confirmError}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  onPress={handleResetPassword}
                  disabled={isResetting}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#4F63FF', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitBtn}
                  >
                    {isResetting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitBtnText}>Reset Password ✓</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={styles.footer}>
            Alumni Association of DUET — Gazipur
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordScreen;

const CARD_RADIUS = 24;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#0A0E27' },
  bg: { ...StyleSheet.absoluteFillObject },
  blob1: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#4F63FF1A',
    top: -40,
    right: -60,
  },
  blob2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#7C3AED15',
    bottom: 120,
    left: -40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    marginBottom: 12,
    gap: 6,
  },
  backArrow: { fontSize: 20, color: '#4F63FF' },
  backLabel: { fontSize: 15, color: '#4F63FF', fontWeight: '600' },
  header: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4F63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: { fontSize: 30, fontWeight: '800', color: '#fff' },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8892B0',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { color: '#fff', fontWeight: '700', fontSize: 14 },
  stepLine: {
    width: 100,
    height: 2,
    backgroundColor: '#1E2347',
    marginHorizontal: 8,
  },
  stepLineActive: { backgroundColor: '#4F63FF' },
  card: {
    backgroundColor: '#161B3A',
    borderRadius: CARD_RADIUS,
    padding: 22,
    borderWidth: 1,
    borderColor: '#2A3060',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  fieldGroup: { marginBottom: 18 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8892B0',
    marginBottom: 7,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1130',
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#2A3060',
    paddingHorizontal: 14,
    height: 50,
  },
  inputError: { borderColor: '#EF4444' },
  input: { flex: 1, color: '#E8ECF4', fontSize: 15 },
  eyeBtn: { paddingLeft: 10, paddingVertical: 4 },
  eyeText: { fontSize: 18 },
  errorText: { marginTop: 4, fontSize: 12, color: '#EF4444' },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
  otpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8892B0',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  otpRoot: { marginBottom: 4 },
  otpCell: {
    flex: 1,
    height: 52,
    margin: 4,
    borderWidth: 2,
    borderColor: '#2A3060',
    borderRadius: 12,
    backgroundColor: '#0D1130',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCellFocused: { borderColor: '#4F63FF' },
  otpCellText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E8ECF4',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: '#3A4060',
    fontSize: 12,
    marginTop: 28,
    letterSpacing: 0.3,
  },
});
