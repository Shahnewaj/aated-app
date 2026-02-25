import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useGetCategoriesQuery,
} from '../lib/services/PostApi';
import Toast from 'react-native-simple-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AddEditPostScreen = ({ navigation, route }: any) => {
  const post = route.params?.post;
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');
  const [category, setCategory] = useState<number | null>(
    post?.category?.id || null,
  );
  const [attachments, setAttachments] = useState<string[]>(
    post?.attachments || [],
  );

  const { data: categoriesResponse } = useGetCategoriesQuery({});
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const insets = useSafeAreaInsets();

  const categories = categoriesResponse?.data || [];

  const handleSave = async () => {
    if (!title || !body || !category) {
      Toast.show('Please fill all required fields');
      return;
    }

    try {
      if (isEdit) {
        await updatePost({ id: post.id, title, body, category }).unwrap();
        Toast.show('Post updated successfully');
      } else {
        await createPost({ title, body, category, attachments }).unwrap();
        Toast.show('Post created successfully');
      }
      navigation.goBack();
    } catch (error) {
      Toast.show('Failed to save post');
    }
  };

  const handleAddImage = () => {
    if (attachments.length >= 2) {
      Alert.alert('Limit Reached', 'You can only add up to 2 images.');
      return;
    }
    // For now, using a placeholder since we don't have an image picker library imported yet
    // In a real app, we'd use react-native-image-crop-picker or similar
    const placeholderImg = 'https://via.placeholder.com/400';
    setAttachments([...attachments, placeholderImg]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E27" />
      <LinearGradient
        colors={['#0A0E27', '#111636']}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Post' : 'Create Post'}
        </Text>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveText}>Post</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catRow}
        >
          {categories.map((cat: any) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catChip,
                category === cat.id && styles.catChipSelected,
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Text
                style={[
                  styles.catText,
                  category === cat.id && styles.catTextSelected,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TextInput
          style={styles.titleInput}
          placeholder="Give it a title..."
          placeholderTextColor="#5A6080"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.bodyInput}
          placeholder="Share your thoughts with the community..."
          placeholderTextColor="#5A6080"
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.imageSection}>
          <Text style={styles.label}>Attachments (Max 2)</Text>
          <View style={styles.imageList}>
            {attachments.map((url, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: url }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImg}
                  onPress={() =>
                    setAttachments(attachments.filter((_, i) => i !== index))
                  }
                >
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
            {attachments.length < 2 && (
              <TouchableOpacity
                style={styles.addImgBtn}
                onPress={handleAddImage}
              >
                <Ionicons name="image-outline" size={30} color="#4F63FF" />
                <Text style={styles.addImgText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  saveBtn: {
    backgroundColor: '#4F63FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  content: { flex: 1, padding: 20 },
  label: {
    color: '#8892B0',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  catRow: { flexDirection: 'row', marginBottom: 25 },
  catChip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#161B3A',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#2A3060',
  },
  catChipSelected: { backgroundColor: '#4F63FF', borderColor: '#4F63FF' },
  catText: { color: '#8892B0', fontSize: 13, fontWeight: '700' },
  catTextSelected: { color: '#fff' },
  titleInput: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    paddingVertical: 10,
  },
  bodyInput: {
    color: '#E8ECF4',
    fontSize: 16,
    lineHeight: 24,
    minHeight: 150,
    paddingBottom: 30,
  },
  imageSection: { marginTop: 20, paddingBottom: 40 },
  imageList: { flexDirection: 'row', gap: 15 },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  removeImg: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  addImgBtn: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#4F63FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F63FF05',
  },
  addImgText: {
    color: '#4F63FF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5,
  },
});

export default AddEditPostScreen;
