import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useGetPostsQuery,
  useGetCategoriesQuery,
  useDeletePostMutation,
} from '../lib/services/PostApi';
import { RouteMap } from '../navigation/RouteMap';
import { useAppSelector } from '../lib/store/hooks';
import moment from 'moment';

const HomeScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { user } = useAppSelector(state => state.user);

  const { data: categoriesResponse } = useGetCategoriesQuery({});
  const {
    data: postsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetPostsQuery({
    category: selectedCategory || undefined,
  });
  const [deletePost] = useDeletePostMutation();

  const posts = postsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  const handleDelete = (postId: number) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deletePost(postId),
      },
    ]);
  };

  const renderPost = ({ item }: { item: any }) => {
    const isOwnPost = item.user?.id === user?.id;

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(RouteMap.MemberDetails, { id: item.user?.id })
            }
            style={styles.authorSection}
          >
            {item.user?.profile_pic ? (
              <Image
                source={{ uri: item.user.profile_pic }}
                style={styles.authorAvatar}
              />
            ) : (
              <View style={styles.authorPlaceholder}>
                <Text style={styles.authorInitial}>
                  {item.user?.name?.charAt(0)}
                </Text>
              </View>
            )}
            <View>
              <Text style={styles.authorName}>{item.user?.name}</Text>
              <Text style={styles.postTime}>
                {moment(item.created_at).fromNow()}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {item.category?.name}
              </Text>
            </View>
            {isOwnPost && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(RouteMap.AddEditPost, { post: item })
                  }
                >
                  <Ionicons name="create-outline" size={20} color="#8892B0" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(RouteMap.PostDetails, { id: item.id })
          }
        >
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postBody} numberOfLines={3}>
            {item.body}
          </Text>

          {item.attachments && item.attachments.length > 0 && (
            <View style={styles.attachmentsRow}>
              {item.attachments.map((url: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  style={styles.attachmentImg}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.postFooter}>
          <TouchableOpacity
            style={styles.footerAction}
            onPress={() =>
              navigation.navigate(RouteMap.PostDetails, { id: item.id })
            }
          >
            <Ionicons name="chatbubble-outline" size={20} color="#8892B0" />
            <Text style={styles.footerText}>
              {item.total_comments || 0} Comments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerAction}>
            <Ionicons name="share-social-outline" size={20} color="#8892B0" />
            <Text style={styles.footerText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />

      <LinearGradient colors={['#0A0E27', '#111636']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Alumni Feed</Text>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate(RouteMap.AddEditPost)}
          >
            <LinearGradient
              colors={['#4F63FF', '#7C3AED']}
              style={styles.createGradient}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !selectedCategory && styles.categoryChipSelected,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryText,
                !selectedCategory && styles.categoryTextSelected,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((cat: any) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextSelected,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F63FF" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor="#4F63FF"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="newspaper-outline" size={60} color="#1E2347" />
              <Text style={styles.emptyText}>
                No posts yet. Be the first to share!
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
  header: { paddingTop: 60, paddingBottom: 15 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  createBtn: { width: 44, height: 44, borderRadius: 14, overflow: 'hidden' },
  createGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  categoriesScroll: { maxHeight: 50 },
  categoriesContent: { paddingHorizontal: 20, gap: 10 },
  categoryChip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#161B3A',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A3060',
  },
  categoryChipSelected: { backgroundColor: '#4F63FF', borderColor: '#4F63FF' },
  categoryText: { color: '#8892B0', fontSize: 13, fontWeight: '700' },
  categoryTextSelected: { color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  feedContent: { padding: 15 },
  postCard: {
    backgroundColor: '#161B3A',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2A3060',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  authorSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#4F63FF',
  },
  authorPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E2347',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#4F63FF',
  },
  authorInitial: { color: '#4F63FF', fontWeight: '700' },
  authorName: { color: '#E8ECF4', fontWeight: '700', fontSize: 15 },
  postTime: { color: '#5A6080', fontSize: 11, marginTop: 2 },
  headerRight: { alignItems: 'flex-end', gap: 8 },
  categoryBadge: {
    backgroundColor: '#4F63FF15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: '#4F63FF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  actionRow: { flexDirection: 'row', gap: 12 },
  postTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  postBody: {
    color: '#8892B0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  attachmentsRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  attachmentImg: {
    flex: 1,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#0A0E27',
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2A3060',
    paddingTop: 12,
    gap: 20,
  },
  footerAction: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { color: '#8892B0', fontSize: 13, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: {
    color: '#5A6080',
    marginTop: 15,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default HomeScreen;
