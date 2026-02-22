import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetMemberDetailsQuery } from '../lib/services/UserApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

const MemberDetailsScreen = ({
  navigation,
  route,
}: {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, any>;
}) => {
  const { id } = route.params || {};
  const { data: memberResponse, isLoading } = useGetMemberDetailsQuery(id);
  const member = memberResponse?.data;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F63FF" />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Member not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={['#4F63FF', '#7C3AED']}
          style={styles.headerGradient}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              {member.profile_pic ? (
                <Image
                  source={{ uri: member.profile_pic }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {member.name?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberDesignation}>
              {member.professional_designation || 'Alumni Member'}
            </Text>

            <View style={styles.headerTags}>
              <View style={styles.headerTag}>
                <Ionicons name="school" size={12} color="#fff" />
                <Text style={styles.headerTagText}>
                  {member.batch?.name || `Batch ${member.batch_no}`}
                </Text>
              </View>
              <View style={styles.headerTag}>
                <Ionicons name="calendar" size={12} color="#fff" />
                <Text style={styles.headerTagText}>
                  Class of {member.passing_year || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Info Grid */}
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <InfoItem
              icon="mail-outline"
              label="Email"
              value={member.email}
              onPress={() => Linking.openURL(`mailto:${member.email}`)}
            />
            <InfoItem
              icon="call-outline"
              label="Phone"
              value={member.phone || 'Not provided'}
              onPress={
                member.phone
                  ? () => Linking.openURL(`tel:${member.phone}`)
                  : undefined
              }
            />
            <InfoItem
              icon="location-outline"
              label="Location"
              value={member.contact_details || 'Not provided'}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic Details</Text>
            <InfoItem
              icon="id-card-outline"
              label="Student ID"
              value={member.student_id || 'N/A'}
            />
            <InfoItem
              icon="briefcase-outline"
              label="Current Status"
              value={member.employment_status || 'N/A'}
            />
            <InfoItem
              icon="star-outline"
              label="Expertise"
              value={member.expertise_area || 'N/A'}
            />
          </View>

          {/* Experience Section */}
          {member.experiences && member.experiences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              {member.experiences.map((exp: any) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.expDot} />
                  <View style={styles.expContent}>
                    <Text style={styles.expDesignation}>{exp.designation}</Text>
                    <Text style={styles.expCompany}>{exp.company_name}</Text>
                    <Text style={styles.expMeta}>
                      {exp.start} — {exp.end || 'Present'}
                    </Text>
                    <Text style={styles.expLocation}>{exp.job_location}</Text>
                    {exp.responsibilities && (
                      <Text style={styles.expDesc}>{exp.responsibilities}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ icon, label, value, onPress }: any) => (
  <TouchableOpacity
    style={styles.infoItem}
    disabled={!onPress}
    onPress={onPress}
  >
    <View style={styles.infoIconWrapper}>
      <Ionicons name={icon} size={20} color="#4F63FF" />
    </View>
    <View style={styles.infoTextWrapper}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text
        style={[
          styles.infoValue,
          onPress && { color: '#4F63FF', textDecorationLine: 'underline' },
        ]}
      >
        {value}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: { alignItems: 'center', paddingHorizontal: 20 },
  avatarWrapper: { marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInitial: { fontSize: 40, fontWeight: '800', color: '#fff' },
  memberName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
  },
  memberDesignation: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 15,
  },
  headerTags: { flexDirection: 'row', gap: 10 },
  headerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  headerTagText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  content: { padding: 20 },
  section: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4F63FF',
    paddingLeft: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#161B3A',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A3060',
  },
  infoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#4F63FF15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  infoTextWrapper: { flex: 1 },
  infoLabel: {
    fontSize: 12,
    color: '#8892B0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  infoValue: { fontSize: 15, fontWeight: '600', color: '#E8ECF4' },
  experienceItem: { flexDirection: 'row', marginBottom: 20 },
  expDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4F63FF',
    marginTop: 6,
    marginRight: 15,
    zIndex: 1,
  },
  expContent: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#2A3060',
    paddingLeft: 20,
    marginLeft: -21,
    paddingBottom: 10,
  },
  expDesignation: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E8ECF4',
    marginBottom: 4,
  },
  expCompany: {
    fontSize: 14,
    color: '#4F63FF',
    fontWeight: '600',
    marginBottom: 4,
  },
  expMeta: { fontSize: 12, color: '#8892B0', marginBottom: 8 },
  expLocation: {
    fontSize: 12,
    color: '#5A6080',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  expDesc: { fontSize: 14, color: '#8892B0', lineHeight: 20 },
});

export default MemberDetailsScreen;
