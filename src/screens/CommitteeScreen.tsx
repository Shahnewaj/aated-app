import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetCommitteesQuery } from '../lib/services/CommitteeApi';
import { RouteMap } from '../navigation/RouteMap';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CommitteeScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) => {
  const { data: committeesResponse, isLoading } = useGetCommitteesQuery({});
  const committees = committeesResponse?.data || [];
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.committeeCard}
      onPress={() =>
        navigation.navigate(RouteMap.CommitteeDetails, {
          id: item.id,
          name: item.name,
        })
      }
    >
      <View style={styles.cardContent}>
        <View style={styles.infoSection}>
          <Text style={styles.committeeName}>{item.name}</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#8892B0" />
            <Text style={styles.dateText}>
              {item.start_date} — {item.end_date || 'Present'}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.is_active ? '#4F63FF20' : '#EF444420' },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: item.is_active ? '#4F63FF' : '#EF4444' },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: item.is_active ? '#4F63FF' : '#EF4444' },
            ]}
          >
            {item.is_active ? 'Active' : 'Previous'}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#5A6080" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <LinearGradient
        colors={['#0A0E27', '#111636']}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <Text style={styles.headerTitle}>Committees</Text>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F63FF" />
        </View>
      ) : (
        <FlatList
          data={committees}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color="#1E2347" />
              <Text style={styles.emptyText}>No committees found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  header: {
    paddingTop: 30,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20 },
  committeeCard: {
    backgroundColor: '#161B3A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3060',
  },
  cardContent: { flex: 1 },
  infoSection: { marginBottom: 12 },
  committeeName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#E8ECF4',
    marginBottom: 6,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 13, color: '#8892B0' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#5A6080', marginTop: 15, fontSize: 16 },
});

export default CommitteeScreen;
