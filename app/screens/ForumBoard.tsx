import React, {useState, useMemo, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';
import PostDetail from '../components/PostDetail.tsx';
import RichTextEditor from '../../specs/RichTextEditorNativeComponent';
import {useAddPostMutation, useGetPostsQuery} from '../api/postApi.ts';
import {formatKoreanDate} from '../utils/dateFormat.ts';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../store/authSlice.ts';
import LoginRequest from '../components/LoginRequest.tsx';

export default function ForumBoard({navigation}) {
  const { data: postList, error, isLoading } = useGetPostsQuery();
  const [addPost, { isLoading: isAddLoading, isSuccess: isAddSuccess, error: addError }] = useAddPostMutation();

  const [view, setView] = useState('list'); // 'list', 'detail', 'compose'
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const currentUser = useSelector<{ auth: unknown }, ReturnType<typeof selectCurrentUser>>(selectCurrentUser);
  const postArray = useMemo(() => {
    if(isLoading || postList == null) return [];
    const posts = Object.values(postList);
    const pinned = posts.filter(p => p.post_type === 'NOTICE');
    const others = posts.filter(p => p.post_type !== 'NOTICE');
    return [...pinned, ...others];
  }, [postList, isLoading]);

  const selectPost = id => {
    setSelectedPostId(id);
    setView('detail');
  };

  const submitPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setNewTitle('');
    setNewContent('');
    setView('list');
    await addPost({ title: newTitle.trim(), content: newContent.trim()});
  };
  useEffect(() => {
    if(addError && addError.status === 401) {
      alert('엑세스 토큰이 만료되었습니다. 로그인해주세요');
      setView('loginRequest');
    }
  }, [addError]);
  const handleWriteButton = () => {
    if(!currentUser.isLogged) {
      alert('현재 로그인된 유저가 아닙니다. 로그인해주세요');
      setView('loginRequest');

    } else {
      setView('compose');
    }
  }

  useEffect(() => {
    const onBackPress = () => {
      if (view !== 'list') {
        setNewContent('');
        setNewTitle('');
        setView('list');
        return true;   // 뒤로가기 동작을 내가 처리했다 알리기
      }
      return false;    // 기본 동작(앱 종료 등) 허용
    };
    const subsriptBackhandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subsriptBackhandler.remove();
  }, [view]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      // 포럼 화면이 포커스될 때 실행할 로직
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      // 포럼 화면이 언포커스될 때 실행할 로직
      setNewContent('');
      setNewTitle('');
      setView('list');
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const renderPost = ({item, index}:{item: unknown;index:number}) => (
    <TouchableOpacity
      style={[
        styles.postContainer,
        item.post_type === 'NOTICE' && styles.pinnedContainer,
      ]}
      onPress={() => {
        selectPost(index);
      }}>
      {item.post_type === 'NOTICE' && <Text style={styles.pinnedLabel}>공지</Text>}
      <Text style={styles.postTitle}>{item.title}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>작성자: {item.user_name}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>작성일: {formatKoreanDate(item.created_at)}</Text>
        <Text style={styles.metaText}>댓글: {item.comment_count}</Text>
        <Text style={styles.metaText}>조회: {item.view_count}</Text>
      </View>
    </TouchableOpacity>
  );

  if (view === 'list') {
    return (
      isLoading?<Text>로딩중입니다.</Text>:<SafeAreaView style={styles.container}>
        <FlatList
          data={postArray}
          keyExtractor={item => item.id}
          renderItem={renderPost}
        />
        <TouchableOpacity style={styles.fab} onPress={handleWriteButton}>
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
        {/*<TouchableOpacity style={styles.fab2} onPress={() => console.log(postArray)}>*/}
        {/*  <Text style={styles.fabIcon}>test</Text>*/}
        {/*</TouchableOpacity>*/}
      </SafeAreaView>
    );
  }

  if (view === 'detail') {
    const post = postArray[selectedPostId];
    return (
      <PostDetail post={post} />
    );
  }

  if (view === 'loginRequest') {
    return <LoginRequest onLoginPress={()=>navigation.navigate('AuthStack')}></LoginRequest>
  }

  // 글쓰기 화면(오른쪽 하단의 +를 누름)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.composeContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="제목을 입력하세요"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>내용</Text>
          <View style={styles.input}>
            <RichTextEditor
              height={200}
              maxLines={100}
              minHeight={100}
              onTextChange={e => {
                setNewContent(e.nativeEvent.text);
              }}
            />
          </View>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setView('list')}>
            <Text style={styles.cancelBtnText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={submitPost}>
            <Text style={styles.submitBtnText}>등록</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#8e44ad', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fab2: { position: 'absolute', bottom: 90, right: 24, backgroundColor: '#8e44ad', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabIcon: { color: '#fff', fontSize: 32 },
  postContainer: { backgroundColor: '#fff', margin: 8, padding: 12, borderRadius: 8, elevation: 2 },
  pinnedContainer: { borderLeftWidth: 4, borderColor: '#8e44ad', backgroundColor: '#f5eafd' },
  pinnedLabel: { position: 'absolute', top: 12, left: 12, backgroundColor: '#8e44ad', color: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontSize: 12, fontWeight: 'bold' },
  postTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, marginLeft: 48 },
  postContent: { fontSize: 14, color: '#555', marginLeft: 48 },
  metaRow: { flexDirection: 'row', marginLeft: 48, marginTop: 8 },
  metaText: { fontSize: 12, color: '#777', marginRight: 12 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  backBtn: { fontSize: 24, color: '#8e44ad', marginRight: 12 },
  postDetail: { padding: 16 },
  detailTitle: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  detailContent: { fontSize: 16, lineHeight: 24, color: '#444', marginVertical: 12 },
  commentSection: { marginTop: 16 },
  commentHeader: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  commentBox: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, elevation: 1 },
  commentMeta: { fontSize: 12, color: '#555', marginBottom: 4 },
  commentText: { fontSize: 14, color: '#333' },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  commentInput: { flex: 1, backgroundColor: '#fff', padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ddd', fontSize: 14, marginRight: 8 },
  submitCommentBtn: { backgroundColor: '#8e44ad', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  submitCommentText: { color: '#fff', fontSize: 14 },
  composeContainer: { padding: 16 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#555' },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  submitBtn: { flex: 1, backgroundColor: '#8e44ad', padding: 12, borderRadius: 6, alignItems: 'center', marginLeft: 8 },
  submitBtnText: { color: '#fff', fontSize: 16 },
  cancelBtn: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#8e44ad', padding: 12, borderRadius: 6, alignItems: 'center', marginRight: 8 },
  cancelBtnText: { color: '#8e44ad', fontSize: 16 }
});
