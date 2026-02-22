import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetCommitteeMembersQuery } from '../lib/services/CommitteeApi';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RouteMap } from '../navigation/RouteMap';

const CommitteeDetailsScreen = ({
  navigation,
  route,
}: {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, any>;
}) => {
  const { id, name } = route.params || {};
  const { data: membersResponse, isLoading } = useGetCommitteeMembersQuery(id);
  const members = membersResponse?.data || [];

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() =>
        navigation.navigate(RouteMap.MemberDetails, { id: item.member?.id })
      }
    >
      <View style={styles.memberInner}>
        <View style={styles.avatarWrapper}>
          {item.member?.profile_pic ? (
            <Image
              source={{ uri: item.member.profile_pic }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {item.member?.name?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {item.member?.name || 'Unknown'}
          </Text>
          <Text style={styles.designation}>{item.committee_designation}</Text>
          <View style={styles.batchRow}>
            <Ionicons name="school-outline" size={13} color="#8892B0" />
            <Text style={styles.batchText}>
              {item.member?.batch?.name ||
                `Batch ${item.member?.batch_number}` ||
                'N/A'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#5A6080" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <LinearGradient colors={['#0A0E27', '#111636']} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.headerSubtitle}>Committee Members</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F63FF" />
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color="#1E2347" />
              <Text style={styles.emptyText}>
                No members found for this committee.
              </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSubtitle: { fontSize: 12, color: '#8892B0', marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20 },
  memberCard: {
    backgroundColor: '#161B3A',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A3060',
  },
  memberInner: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { marginRight: 16 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#4F63FF',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E2347',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4F63FF',
  },
  avatarInitial: { fontSize: 24, fontWeight: '700', color: '#4F63FF' },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E8ECF4',
    marginBottom: 4,
  },
  designation: {
    fontSize: 14,
    color: '#4F63FF',
    fontWeight: '600',
    marginBottom: 6,
  },
  batchRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  batchText: { fontSize: 12, color: '#8892B0' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: {
    color: '#5A6080',
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CommitteeDetailsScreen;
