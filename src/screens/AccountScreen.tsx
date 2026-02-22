import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetProfileQuery } from '../lib/services/ProfileApi';
import { useAppDispatch } from '../lib/store/hooks';
import { appSetLogout } from '../lib/store/features/UserSlice';
import { RouteMap } from '../navigation/RouteMap';

const AccountScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { data: profileResponse, isLoading, error } = useGetProfileQuery({});
  const profile = profileResponse?.data;

  const handleLogout = () => {
    dispatch(appSetLogout());
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F63FF" />
      </View>
    );
  }

  const MenuItem = ({ icon, label, onPress, color = '#E8ECF4' }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconWrapper, { backgroundColor: `${color}1A` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#5A6080" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <LinearGradient
        colors={['#0A0E27', '#111636']}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profile?.profile_pic ? (
              <Image
                source={{ uri: profile.profile_pic }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {profile?.name?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => navigation.navigate(RouteMap.EditProfile)}
            >
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile?.name || 'User'}</Text>
          <Text style={styles.userRole}>
            {profile?.professional_designation || 'Alumni Member'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.infoCard}>
            <InfoRow
              label="Email"
              value={profile?.email || 'N/A'}
              icon="mail-outline"
            />
            <InfoRow
              label="Phone"
              value={profile?.phone || 'N/A'}
              icon="call-outline"
            />
            <InfoRow
              label="Batch"
              value={
                profile?.batch?.name || `Batch ${profile?.batch_no}` || 'N/A'
              }
              icon="school-outline"
            />
            <InfoRow
              label="Student ID"
              value={profile?.student_id || 'N/A'}
              icon="id-card-outline"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="person-outline"
              label="Edit Profile"
              onPress={() => navigation.navigate(RouteMap.EditProfile)}
              color="#4F63FF"
            />
            <MenuItem
              icon="briefcase-outline"
              label="Job Experiences"
              onPress={() => navigation.navigate(RouteMap.JobExperiences)}
              color="#8B5CF6"
            />
            <MenuItem
              icon="lock-closed-outline"
              label="Change Password"
              onPress={() => navigation.navigate(RouteMap.ChangePassword)}
              color="#F59E0B"
            />
            <MenuItem
              icon="log-out-outline"
              label="Sign Out"
              onPress={handleLogout}
              color="#EF4444"
            />
          </View>
        </View>

        <Text style={styles.footer}>Alumni Association of DUET</Text>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value, icon }: any) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={16} color="#5A6080" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
  },
  headerGradient: { paddingTop: 60, paddingBottom: 30, alignItems: 'center' },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4F63FF',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E2347',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#4F63FF',
  },
  avatarText: { fontSize: 40, fontWeight: '800', color: '#4F63FF' },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4F63FF',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0A0E27',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: { fontSize: 14, color: '#8892B0' },
  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginTop: 25 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A6080',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 5,
  },
  infoCard: {
    backgroundColor: '#161B3A',
    borderRadius: 20,
    padding: 20,
    gap: 18,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoIcon: { marginRight: 15 },
  infoLabel: { fontSize: 12, color: '#8892B0', marginBottom: 2 },
  infoValue: { fontSize: 15, color: '#E8ECF4', fontWeight: '500' },
  menuCard: {
    backgroundColor: '#161B3A',
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3060',
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuLabel: { fontSize: 15, color: '#E8ECF4', fontWeight: '500' },
  footer: {
    textAlign: 'center',
    color: '#3A4060',
    fontSize: 12,
    marginVertical: 30,
  },
});

export default AccountScreen;
