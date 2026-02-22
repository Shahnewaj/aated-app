import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useGetExperiencesQuery,
  useDeleteExperienceMutation,
} from '../lib/services/ProfileApi';
import { RouteMap } from '../navigation/RouteMap';
import Toast from 'react-native-simple-toast';

const JobExperiencesScreen = ({ navigation }: any) => {
  const {
    data: experiencesResponse,
    isLoading,
    refetch,
  } = useGetExperiencesQuery({});
  const [deleteExperience, { isLoading: isDeleting }] =
    useDeleteExperienceMutation();
  const experiences = experiencesResponse?.data || [];

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Experience',
      'Are you sure you want to delete this job experience?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExperience(id).unwrap();
              Toast.show('Deleted successfully', Toast.SHORT);
            } catch (err: any) {
              Toast.show('Failed to delete', Toast.SHORT);
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.experienceCard}>
      <View style={styles.cardHeader}>
        <View style={styles.companyInfo}>
          <Text style={styles.designation}>{item.designation}</Text>
          <Text style={styles.companyName}>{item.company_name}</Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(RouteMap.AddEditExperience, {
                experience: item,
              })
            }
            style={styles.actionBtn}
          >
            <Ionicons name="pencil" size={18} color="#4F63FF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.actionBtn}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <Ionicons name="calendar-outline" size={14} color="#8892B0" />
        <Text style={styles.detailsText}>
          {item.start} — {item.end || 'Present'}
        </Text>
      </View>

      {item.job_location && (
        <View style={styles.detailsRow}>
          <Ionicons name="location-outline" size={14} color="#8892B0" />
          <Text style={styles.detailsText}>{item.job_location}</Text>
        </View>
      )}

      {item.responsibilities && (
        <Text style={styles.responsibilities} numberOfLines={2}>
          {item.responsibilities}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <LinearGradient colors={['#0A0E27', '#111636']} style={styles.bg} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Job Experiences</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F63FF" />
        </View>
      ) : (
        <FlatList
          data={experiences}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={60} color="#1E2347" />
              <Text style={styles.emptyText}>No experiences added yet.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(RouteMap.AddEditExperience)}
      >
        <LinearGradient
          colors={['#4F63FF', '#7C3AED']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  bg: { ...StyleSheet.absoluteFillObject },
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20, paddingBottom: 100 },
  experienceCard: {
    backgroundColor: '#161B3A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A3060',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  companyInfo: { flex: 1 },
  designation: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E8ECF4',
    marginBottom: 2,
  },
  companyName: { fontSize: 14, color: '#4F63FF', fontWeight: '500' },
  actionRow: { flexDirection: 'row' },
  actionBtn: { padding: 8, marginLeft: 5 },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
  },
  detailsText: { fontSize: 13, color: '#8892B0' },
  responsibilities: {
    fontSize: 13,
    color: '#8892B0',
    marginTop: 10,
    fontStyle: 'italic',
  },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#5A6080', marginTop: 15, fontSize: 16 },
  fab: { position: 'absolute', bottom: 30, right: 20 },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default JobExperiencesScreen;
