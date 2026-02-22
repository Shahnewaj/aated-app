import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useGetAllMembersQuery,
  useGetBatchesQuery,
  useGetOccupationsQuery,
} from '../lib/services/UserApi';
import { RouteMap } from '../navigation/RouteMap';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import _ from 'lodash';

const MembersScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) => {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    batch: '',
    occupation_type: '',
    employment_status: '',
  });

  // API Calls
  const {
    data: membersResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllMembersQuery({
    name: search,
    batch: filters.batch,
    occupation_type: filters.occupation_type,
    employment_status: filters.employment_status,
  });

  const { data: batchesResponse } = useGetBatchesQuery({});
  const { data: occupationsResponse } = useGetOccupationsQuery({});

  const members = membersResponse?.data || [];
  const batches = batchesResponse?.data || [];
  const occupations = occupationsResponse?.data || [];

  const debouncedSearch = useCallback(
    _.debounce((text: string) => setSearch(text), 500),
    [],
  );

  const resetFilters = () => {
    setFilters({ batch: '', occupation_type: '', employment_status: '' });
  };

  const renderMember = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() =>
        navigation.navigate(RouteMap.MemberDetails, { id: item.id })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarWrapper}>
          {item.profile_pic ? (
            <Image source={{ uri: item.profile_pic }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {item.name?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.designation}>
            {item.professional_designation || 'Alumni Member'}
          </Text>
          <View style={styles.footerRow}>
            <View style={styles.tag}>
              <Ionicons name="school-outline" size={12} color="#4F63FF" />
              <Text style={styles.tagText}>
                {item.batch?.name || `Batch ${item.batch_no}`}
              </Text>
            </View>
            {item.employment_status && (
              <View style={[styles.tag, { backgroundColor: '#10B98120' }]}>
                <Text style={[styles.tagText, { color: '#10B981' }]}>
                  {item.employment_status}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#5A6080" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <LinearGradient colors={['#0A0E27', '#111636']} style={styles.topSection}>
        <Text style={styles.headerTitle}>Member Directory</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchWrapper}>
            <Ionicons
              name="search"
              size={20}
              color="#5A6080"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search members, skills..."
              placeholderTextColor="#5A6080"
              onChangeText={debouncedSearch}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              filters.batch ||
              filters.occupation_type ||
              filters.employment_status
                ? styles.filterBtnActive
                : null,
            ]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F63FF" />
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={item => item.id.toString()}
          renderItem={renderMember}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color="#1E2347" />
              <Text style={styles.emptyText}>No members found.</Text>
            </View>
          }
          refreshing={isFetching && !isLoading}
          onRefresh={refetch}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Members</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <FilterLabel label="Batch" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterOptions}
              >
                {batches.map((b: any) => (
                  <FilterChip
                    key={b.id}
                    label={b.name}
                    selected={filters.batch === b.id.toString()}
                    onPress={() =>
                      setFilters(p => ({
                        ...p,
                        batch:
                          p.batch === b.id.toString() ? '' : b.id.toString(),
                      }))
                    }
                  />
                ))}
              </ScrollView>

              <FilterLabel label="Employment Status" />
              <View style={styles.chipGrid}>
                {['employed', 'unemployed', 'student'].map(status => (
                  <FilterChip
                    key={status}
                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                    selected={filters.employment_status === status}
                    onPress={() =>
                      setFilters(p => ({
                        ...p,
                        employment_status:
                          p.employment_status === status ? '' : status,
                      }))
                    }
                  />
                ))}
              </View>

              <FilterLabel label="Occupation Type" />
              <View style={styles.chipGrid}>
                {occupations.map((o: any) => (
                  <FilterChip
                    key={o.id}
                    label={o.name}
                    selected={filters.occupation_type === o.id.toString()}
                    onPress={() =>
                      setFilters(p => ({
                        ...p,
                        occupation_type:
                          p.occupation_type === o.id.toString()
                            ? ''
                            : o.id.toString(),
                      }))
                    }
                  />
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setShowFilters(false)}
              >
                <LinearGradient
                  colors={['#4F63FF', '#7C3AED']}
                  style={styles.applyGradient}
                >
                  <Text style={styles.applyBtnText}>Apply Filters</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const FilterLabel = ({ label }: { label: string }) => (
  <Text style={styles.filterLabel}>{label}</Text>
);

const FilterChip = ({ label, selected, onPress }: any) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  topSection: { paddingTop: 60, paddingBottom: 25, paddingHorizontal: 20 },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
  },
  searchRow: { flexDirection: 'row', gap: 12 },
  searchWrapper: {
    flex: 1,
    backgroundColor: '#161B3A',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#2A3060',
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#E8ECF4', fontSize: 16 },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#161B3A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A3060',
  },
  filterBtnActive: { borderColor: '#4F63FF', backgroundColor: '#4F63FF20' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20 },
  memberCard: {
    backgroundColor: '#161B3A',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3060',
  },
  cardHeader: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { marginRight: 15 },
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
    fontSize: 17,
    fontWeight: '700',
    color: '#E8ECF4',
    marginBottom: 4,
  },
  designation: { fontSize: 13, color: '#8892B0', marginBottom: 8 },
  footerRow: { flexDirection: 'row', gap: 8 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F63FF15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  tagText: { fontSize: 11, fontWeight: '600', color: '#4F63FF' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#5A6080', marginTop: 15, fontSize: 16 },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111636',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: '60%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  modalScroll: { paddingBottom: 30 },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8892B0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
    marginTop: 20,
  },
  filterOptions: { flexDirection: 'row', marginBottom: 10 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1E2347',
    borderWidth: 1,
    borderColor: '#2A3060',
    marginRight: 10,
  },
  chipSelected: { backgroundColor: '#4F63FF', borderColor: '#4F63FF' },
  chipText: { color: '#8892B0', fontSize: 14, fontWeight: '600' },
  chipTextSelected: { color: '#fff' },
  modalFooter: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
    paddingBottom: 20,
  },
  resetBtn: {
    flex: 1,
    height: 55,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  resetBtnText: { color: '#EF4444', fontWeight: '700' },
  applyBtn: { flex: 2, height: 55 },
  applyGradient: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: { color: '#fff', fontWeight: '700' },
});

export default MembersScreen;
