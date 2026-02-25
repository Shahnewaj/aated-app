import React, { useState, useRef } from 'react';
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
  useSignupMutation,
  useVerifyOtpMutation,
  useGetBatchesQuery,
} from '../lib/services/UserApi';
import { RouteMap } from '../navigation/RouteMap';
import Toast from 'react-native-simple-toast';
import RNPickerSelect from 'react-native-picker-select';

const OTP_LENGTH = 6;

// Steps: 0 = Register Form, 1 = OTP Verification
const SignupScreen = ({ navigation }: any) => {
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const { data: batchesData, isLoading: isLoadingBatches } = useGetBatchesQuery(
    {},
  );

  const [step, setStep] = useState<0 | 1>(0);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Form state
  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    batch: '',
    student_id: '',
    passing_year: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // OTP field
  const [otpValue, setOtpValue] = useState('');
  const otpRef = useBlurOnFulfill({ value: otpValue, cellCount: OTP_LENGTH });
  const [otpProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: setOtpValue,
  });

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    if (!form.batch.trim()) e.batch = 'Batch is required';
    if (!form.student_id.trim()) e.student_id = 'Student ID is required';
    if (!form.passing_year.trim()) e.passing_year = 'Passing year is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    try {
      await signup({
        email: form.email.trim(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        password: form.password,
        batch: form.batch.trim(),
        student_id: form.student_id.trim(),
        passing_year: form.passing_year.trim(),
      }).unwrap();
      setRegisteredEmail(form.email.trim());
      Toast.show('OTP sent to your email!', Toast.SHORT);
      setStep(1);
    } catch (err: any) {
      const errData = err?.data;
      if (errData && typeof errData === 'object') {
        const fieldErrors: Record<string, string> = {};
        // The API might return { "field": ["error message"] } or { "field": "error message" }
        Object.keys(errData).forEach(key => {
          const val = errData[key];
          fieldErrors[key] = Array.isArray(val) ? val[0] : String(val);
        });
        setErrors(fieldErrors);

        // Also show a general toast if there's a specific message or detail
        const generalMsg =
          errData.message ||
          errData.detail ||
          'Registration failed. Please check the fields.';
        Toast.show(generalMsg, Toast.LONG);
      } else {
        Toast.show(
          err?.data?.message ||
            err?.data?.detail ||
            'Registration failed. Try again.',
          Toast.LONG,
        );
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length < OTP_LENGTH) {
      Toast.show('Please enter the full 6-digit OTP', Toast.SHORT);
      return;
    }
    try {
      await verifyOtp({ email: registeredEmail, otp: otpValue }).unwrap();
      Toast.show(
        'Account verified! Your registration is pending admin approval.',
        Toast.LONG,
      );
      // Navigate back to signin after successful OTP
      navigation.navigate(RouteMap.Signin);
    } catch (err: any) {
      const detail =
        err?.data?.detail ||
        err?.data?.message ||
        'Invalid OTP. Please try again.';
      Toast.show(detail, Toast.LONG);
    }
  };

  const updateField = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const InputField = ({
    label,
    field,
    placeholder,
    keyboardType = 'default',
    autoCapitalize = 'words',
    secureTextEntry = false,
  }: any) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.inputWrapper, errors[field] ? styles.inputError : null]}
      >
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={placeholder}
          placeholderTextColor="#5A6080"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          value={form[field as keyof typeof form]}
          onChangeText={v => updateField(field, v)}
        />
      </View>
      {errors[field] ? (
        <Text style={styles.errorText}>{errors[field]}</Text>
      ) : null}
    </View>
  );

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
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#4F63FF', '#8B5CF6']}
              style={styles.logoCircle}
            >
              <Text style={styles.logoText}>A</Text>
            </LinearGradient>
            <Text style={styles.title}>
              {step === 0 ? 'Create Account' : 'Verify Email'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 0
                ? 'Join the DUET Alumni community'
                : `Enter the OTP sent to ${registeredEmail}`}
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
                    style={[styles.stepLine, i < step && styles.stepLineActive]}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Card */}
          <View style={styles.card}>
            {step === 0 ? (
              <>
                <InputField
                  label="Full Name"
                  field="name"
                  placeholder="Your full name"
                />
                <InputField
                  label="Email Address"
                  field="email"
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <InputField
                  label="Phone Number"
                  field="phone"
                  placeholder="+880XXXXXXXXXX"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />

                <View style={styles.row}>
                  <View
                    style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}
                  >
                    <Text style={styles.label}>Batch</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.batch ? styles.inputError : null,
                        { paddingHorizontal: 0 }, // Adjust for picker
                      ]}
                    >
                      <RNPickerSelect
                        placeholder={{
                          label: isLoadingBatches
                            ? 'Loading...'
                            : 'Select Batch',
                          value: '',
                        }}
                        items={(batchesData?.results || []).map((b: any) => ({
                          label: b.name,
                          value: String(b.name), // The API expects batch name or ID? Usually name string
                        }))}
                        onValueChange={v => updateField('batch', v)}
                        value={form.batch}
                        style={{
                          inputIOS: pickerStyles.input,
                          inputAndroid: pickerStyles.input,
                          placeholder: { color: '#5A6080' },
                        }}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>
                    {errors.batch ? (
                      <Text style={styles.errorText}>{errors.batch}</Text>
                    ) : null}
                  </View>
                  <View style={[styles.fieldGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>Passing Year</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.passing_year ? styles.inputError : null,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. 2019"
                        placeholderTextColor="#5A6080"
                        keyboardType="numeric"
                        value={form.passing_year}
                        onChangeText={v => updateField('passing_year', v)}
                      />
                    </View>
                    {errors.passing_year ? (
                      <Text style={styles.errorText}>
                        {errors.passing_year}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <InputField
                  label="Student ID"
                  field="student_id"
                  placeholder="e.g. 1504016"
                  keyboardType="default"
                  autoCapitalize="none"
                />

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
                      placeholder="Min. 6 characters"
                      placeholderTextColor="#5A6080"
                      secureTextEntry={!showPassword}
                      value={form.password}
                      onChangeText={v => updateField('password', v)}
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

                {/* Confirm Password */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.confirmPassword ? styles.inputError : null,
                    ]}
                  >
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Re-enter password"
                      placeholderTextColor="#5A6080"
                      secureTextEntry={!showPassword}
                      value={form.confirmPassword}
                      onChangeText={v => updateField('confirmPassword', v)}
                    />
                  </View>
                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  onPress={handleSignup}
                  disabled={isSigningUp}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#4F63FF', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitBtn}
                  >
                    {isSigningUp ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitBtnText}>Send OTP →</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              /* OTP Step */
              <>
                <Text style={styles.otpInfo}>
                  Check your inbox and enter the 6-digit code below
                </Text>

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

                <TouchableOpacity
                  onPress={handleVerifyOtp}
                  disabled={isVerifying}
                  activeOpacity={0.85}
                  style={{ marginTop: 28 }}
                >
                  <LinearGradient
                    colors={['#4F63FF', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitBtn}
                  >
                    {isVerifying ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitBtnText}>
                        Verify & Continue
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => setStep(0)}
                >
                  <Text style={styles.backBtnText}>← Go back & Edit</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Already a member?</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate(RouteMap.Signin)}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryBtnText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>AATED</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupScreen;

const CARD_RADIUS = 24;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#0A0E27' },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  blob1: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#4F63FF22',
    top: -50,
    right: -70,
  },
  blob2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#7C3AED18',
    bottom: 100,
    left: -50,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 28,
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
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: { fontSize: 30, fontWeight: '800', color: '#fff' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#8892B0',
    letterSpacing: 0.2,
    textAlign: 'center',
    paddingHorizontal: 20,
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
  row: { flexDirection: 'row' },
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
  input: { color: '#E8ECF4', fontSize: 15 },
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
  // OTP
  otpInfo: {
    textAlign: 'center',
    color: '#8892B0',
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 22,
  },
  otpRoot: {
    marginHorizontal: 8,
  },
  otpCell: {
    flex: 1,
    height: 54,
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
  backBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  backBtnText: { color: '#8892B0', fontSize: 14 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#2A3060' },
  dividerText: { color: '#5A6080', fontSize: 13, flexShrink: 1 },
  secondaryBtn: {
    height: 50,
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

const pickerStyles = StyleSheet.create({
  input: {
    fontSize: 15,
    paddingHorizontal: 14,
    color: '#E8ECF4',
    height: 50,
    width: '100%',
  },
});
