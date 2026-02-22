import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '../lib/services/ProfileApi';
import Toast from 'react-native-simple-toast';

const EditProfileScreen = ({ navigation }: any) => {
  const { data: profileResponse, isLoading: isFetching } = useGetProfileQuery(
    {},
  );
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    professional_designation: '',
    employment_status: '',
    expertise_area: '',
    contact_details: '',
  });

  useEffect(() => {
    if (profileResponse?.data) {
      const p = profileResponse.data;
      setFormData({
        name: p.name || '',
        phone: p.phone || '',
        professional_designation: p.professional_designation || '',
        employment_status: p.employment_status || '',
        expertise_area: p.expertise_area || '',
        contact_details: p.contact_details || '',
      });
    }
  }, [profileResponse]);

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      Toast.show('Profile updated successfully!', Toast.SHORT);
      navigation.goBack();
    } catch (err: any) {
      Toast.show(err?.data?.message || 'Failed to update profile', Toast.LONG);
    }
  };

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F63FF" />
      </View>
    );
  }

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
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isUpdating}>
          {isUpdating ? (
            <ActivityIndicator color="#4F63FF" />
          ) : (
            <Text style={styles.saveBtn}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <InputField
            label="Full Name"
            value={formData.name}
            onChangeText={(v: string) => setFormData(p => ({ ...p, name: v }))}
            placeholder="Enter your name"
          />
          <InputField
            label="Phone Number"
            value={formData.phone}
            onChangeText={(v: string) => setFormData(p => ({ ...p, phone: v }))}
            placeholder="017XXXXXXXX"
            keyboardType="phone-pad"
          />
          <InputField
            label="Designation"
            value={formData.professional_designation}
            onChangeText={(v: string) =>
              setFormData(p => ({ ...p, professional_designation: v }))
            }
            placeholder="e.g. Software Engineer"
          />
          <InputField
            label="Employment Status"
            value={formData.employment_status}
            onChangeText={(v: string) =>
              setFormData(p => ({ ...p, employment_status: v }))
            }
            placeholder="e.g. employed, student"
          />
          <InputField
            label="Expertise Area"
            value={formData.expertise_area}
            onChangeText={(v: string) =>
              setFormData(p => ({ ...p, expertise_area: v }))
            }
            placeholder="e.g. React Native, Python"
            multiline
          />
          <InputField
            label="Contact Details"
            value={formData.contact_details}
            onChangeText={(v: string) =>
              setFormData(p => ({ ...p, contact_details: v }))
            }
            placeholder="Address, City, Country"
            multiline
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  ...props
}: any) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={[
          styles.input,
          props.multiline && {
            height: 100,
            textAlignVertical: 'top',
            paddingTop: 12,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#5A6080"
        {...props}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject },
  container: { flex: 1, backgroundColor: '#0A0E27' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
  },
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
  saveBtn: { fontSize: 16, fontWeight: '700', color: '#4F63FF' },
  scrollContent: { padding: 20, paddingBottom: 50 },
  fieldGroup: { marginBottom: 20 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8892B0',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    backgroundColor: '#161B3A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A3060',
    paddingHorizontal: 15,
  },
  input: { height: 50, color: '#E8ECF4', fontSize: 15 },
});

export default EditProfileScreen;
