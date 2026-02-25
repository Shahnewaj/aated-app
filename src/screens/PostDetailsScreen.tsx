import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useGetPostDetailsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useRemoveCommentMutation,
} from '../lib/services/PostApi';
import { useAppSelector } from '../lib/store/hooks';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PostDetailsScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const { user } = useAppSelector(state => state.user);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

  const { data: postResponse, isLoading } = useGetPostDetailsQuery(id);
  const [createComment, { isLoading: isCommenting }] =
    useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [removeComment] = useRemoveCommentMutation();

  const post = postResponse?.data;
  const comments = post?.comments || [];

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    try {
      if (editingCommentId) {
        await updateComment({
          comment_id: editingCommentId,
          comment: commentText,
        }).unwrap();
        setEditingCommentId(null);
      } else {
        await createComment({ post: id, comment: commentText }).unwrap();
      }
      setCommentText('');
      Toast.show('Comment posted');
    } catch (error) {
      Toast.show('Failed to post comment');
    }
  };

  const handleEditComment = (comment: any) => {
    setCommentText(comment.comment);
    setEditingCommentId(comment.id);
  };

  const handleDeleteComment = (commentId: number) => {
    Alert.alert(
      'Remove Comment',
      'Are you sure you want to remove this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () =>
            removeComment({ comment_id: commentId, is_active: false }),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F63FF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <LinearGradient
        colors={['#0A0E27', '#111636']}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Thread</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <FlatList
        data={comments}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.postSection}>
            <View style={styles.authorRow}>
              {post?.user?.profile_pic ? (
                <Image
                  source={{ uri: post.user.profile_pic }}
                  style={styles.authorAvatar}
                />
              ) : (
                <View style={styles.authorPlaceholder}>
                  <Text style={styles.authorInitial}>
                    {post?.user?.name?.charAt(0)}
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.authorName}>{post?.user?.name}</Text>
                <Text style={styles.postTime}>
                  {moment(post?.created_at).format('LLL')}
                </Text>
              </View>
            </View>
            <Text style={styles.postTitle}>{post?.title}</Text>
            <Text style={styles.postBody}>{post?.body}</Text>

            {post?.attachments && post.attachments.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.attachmentsRow}
              >
                {post.attachments.map((url: string, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={styles.attachmentImg}
                  />
                ))}
              </ScrollView>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble-outline" size={16} color="#8892B0" />
                <Text style={styles.statText}>{comments.length} Comments</Text>
              </View>
            </View>

            <View style={styles.divider} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            {item.user?.profile_pic ? (
              <Image
                source={{ uri: item.user.profile_pic }}
                style={styles.commentAvatar}
              />
            ) : (
              <View
                style={[styles.authorPlaceholder, { width: 32, height: 32 }]}
              >
                <Text style={[styles.authorInitial, { fontSize: 12 }]}>
                  {item.user?.name?.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{item.user?.name}</Text>
                <Text style={styles.commentTime}>
                  {moment(item.created_at).fromNow()}
                </Text>
              </View>
              <Text style={styles.commentText}>{item.comment}</Text>

              {item.user?.id === user?.id && (
                <View style={styles.commentActions}>
                  <TouchableOpacity onPress={() => handleEditComment(item)}>
                    <Text style={styles.commentActionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteComment(item.id)}
                  >
                    <Text
                      style={[styles.commentActionText, { color: '#EF4444' }]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputArea}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.commentInput}
            placeholder={
              editingCommentId ? 'Edit your comment...' : 'Add a comment...'
            }
            placeholderTextColor="#5A6080"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !commentText.trim() && { opacity: 0.5 }]}
            onPress={handleSendComment}
            disabled={!commentText.trim() || isCommenting}
          >
            {isCommenting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        {editingCommentId && (
          <TouchableOpacity
            style={styles.cancelEdit}
            onPress={() => {
              setEditingCommentId(null);
              setCommentText('');
            }}
          >
            <Text style={styles.cancelEditText}>Cancel Editing</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E27' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
  },
  listContent: { paddingBottom: 100 },
  postSection: { padding: 20 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#4F63FF',
  },
  authorPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E2347',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#4F63FF',
  },
  authorInitial: { color: '#4F63FF', fontWeight: '700', fontSize: 16 },
  authorName: { color: '#E8ECF4', fontWeight: '700', fontSize: 16 },
  postTime: { color: '#5A6080', fontSize: 12, marginTop: 2 },
  postTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  postBody: {
    color: '#8892B0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  attachmentsRow: { marginBottom: 20 },
  attachmentImg: {
    width: 280,
    height: 200,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#161B3A',
  },
  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { color: '#8892B0', fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#2A3060', width: '100%' },
  commentCard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#161B3A',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#4F63FF',
  },
  commentContent: { flex: 1 },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: { color: '#E8ECF4', fontWeight: '700', fontSize: 14 },
  commentTime: { color: '#5A6080', fontSize: 10 },
  commentText: { color: '#8892B0', fontSize: 14, lineHeight: 20 },
  commentActions: { flexDirection: 'row', gap: 15, marginTop: 10 },
  commentActionText: { color: '#8892B0', fontSize: 12, fontWeight: '700' },
  inputArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#0A0E27',
    borderTopWidth: 1,
    borderTopColor: '#2A3060',
  },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  commentInput: {
    flex: 1,
    backgroundColor: '#161B3A',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelEdit: { marginTop: 10, alignSelf: 'center' },
  cancelEditText: { color: '#EF4444', fontSize: 12, fontWeight: '700' },
});

export default PostDetailsScreen;
