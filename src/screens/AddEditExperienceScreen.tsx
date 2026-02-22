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
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
} from '../lib/services/ProfileApi';
import Toast from 'react-native-simple-toast';

const AddEditExperienceScreen = ({ navigation, route }: any) => {
  const experience = route.params?.experience;
  const isEditing = !!experience;

  const [createExperience, { isLoading: isCreating }] =
    useCreateExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] =
    useUpdateExperienceMutation();

  const [formData, setFormData] = useState({
    designation: '',
    company_name: '',
    start: '',
    end: '',
    job_location: '',
    job_department: '',
    responsibilities: '',
  });

  const [isCurrentJob, setIsCurrentJob] = useState(false);

  useEffect(() => {
    if (experience) {
      setFormData({
        designation: experience.designation || '',
        company_name: experience.company_name || '',
        start: experience.start || '',
        end: experience.end || '',
        job_location: experience.job_location || '',
        job_department: String(experience.job_department || ''),
        responsibilities: experience.responsibilities || '',
      });
      setIsCurrentJob(!experience.end);
    }
  }, [experience]);

  const handleSave = async () => {
    if (!formData.designation || !formData.company_name || !formData.start) {
      Toast.show('Please fill in required fields', Toast.SHORT);
      return;
    }

    const payload = {
      ...formData,
      end: isCurrentJob ? null : formData.end,
    };

    try {
      if (isEditing) {
        await updateExperience({ id: experience.id, ...payload }).unwrap();
        Toast.show('Updated successfully', Toast.SHORT);
      } else {
        await createExperience(payload).unwrap();
        Toast.show('Created successfully', Toast.SHORT);
      }
      navigation.goBack();
    } catch (err: any) {
      Toast.show('Failed to save', Toast.LONG);
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
        <Text style={styles.title}>
          {isEditing ? 'Edit Experience' : 'Add Experience'}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
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
            label="Designation *"
            value={formData.designation}
            onChangeText={(v: string) =>
              setFormData(p => ({ ...p, designation: v }))
            }
            placeholder="e.g. Senior Developer"
          />
          <InputField
            label="Company Name *"
            value={formData.company_name}
            onChangeText={(v: string) =>
              setFormData(p => ({ ...p, company_name: v }))
            }
            placeholder="e.g. Acme Corp"
          />
          <InputField
            label="Start Date * (YYYY-MM-DD)"
            value={formData.start}
            onChangeText={(v: string) => setFormData(p => ({ ...p, start: v }))}
            placeholder="2021-01-01"
          />

          <View style={styles.switchRow}>
            <Text style={styles.label}>Currently Working Here</Text>
            <Switch
              value={isCurrentJob}
              onValueChange={setIsCurrentJob}
              trackColor={{ false: '#1E2347', true: '#4F63FF' }}
              thumbColor={isCurrentJob ? '#fff' : '#8892B0'}
            />
          </View>

          {!isCurrentJob && (
            <InputField
              label="End Date (YYYY-MM-DD)"
              value={formData.end}
              onChangeText={(v: string) => setFormData(p => ({ ...p, end: v }))}
              placeholder="2023-01-01"
            />
          )}

          <InputField
            label="Job Location"
            value={formData.job_location}
            onChangeText={(v: string) =>
              setFormData(p => ({ ...p, job_location: v }))
            }
            placeholder="e.g. Dhaka"
          />
          <InputField
            label="Responsibilities"
            value={formData.responsibilities}
            onChangeText={(v: string) =>
              setFormData(p => ({ ...p, responsibilities: v }))
            }
            placeholder="Describe your role..."
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingRight: 5,
  },
});

export default AddEditExperienceScreen;
