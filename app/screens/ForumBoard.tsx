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
import RichTextEditor from '../../specs/RichTextEditorNativeComponent.ts';
import RenderHTML from 'react-native-render-html';

export default function ForumBoard() {
  const [postsData, setPostsData] = useState({
    announce: {
      id: 'announce',
      title: '📢 관리자 공지',
      date: '2025-04-27',
      author: '관리자',
      views: 340,
      content: '새로운 기능 업데이트가 적용되었습니다. 카테고리 추가 및 댓글 좋아요 기능이 추가되었으니 확인해 보세요!',
      comments: [
        { author: '홍길동', time: '2025-04-27 10:15', text: '정말 유용한 업데이트네요! 감사합니다 😊' },
        { author: '이영희', time: '2025-04-27 09:42', text: '카테고리 기능 너무 기다렸어요!' }
      ]
    },
    '1': {
      id: '1', title: '핫딜 정보 공유합니다!', date: '2025-04-26', author: '사용자A', views: 120,
      content: '오늘 아침에 확인한 핫딜 링크와 할인 쿠폰 정보를 공유합니다. 놓치지 마세요!', comments: []
    },
    '2': {
      id: '2', title: '가격 변동 알림 설정 방법', date: '2025-04-24', author: '사용자B', views: 200,
      content: '키워드 알림을 설정해서 할인 정보를 받을 수 있는 방법을 단계별로 정리했습니다.', comments: []
    }
  });
  const [view, setView] = useState('list'); // 'list', 'detail', 'compose'
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [counter, setCounter] = useState(3);

  const postArray = useMemo(() => {
    const posts = Object.values(postsData);
    const pinned = posts.filter(p => p.id === 'announce');
    const others = posts.filter(p => p.id !== 'announce');
    return [...pinned, ...others];
  }, [postsData]);

  const selectPost = id => {
    setSelectedPostId(id);
    setView('detail');
    // increment view count
    setPostsData(prev => ({
      ...prev,
      [id]: { ...prev[id], views: prev[id].views + 1 }
    }));
  };

  const submitComment = () => {
    if (!newComment.trim()) return;
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
    setPostsData(prev => ({
      ...prev,
      [selectedPostId]: {
        ...prev[selectedPostId],
        comments: [...prev[selectedPostId].comments, { author: '나', time: timestamp, text: newComment.trim() }]
      }
    }));
    setNewComment('');
  };

  const submitPost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const id = String(counter);
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    setPostsData(prev => ({
      ...prev,
      [id]: { id, title: newTitle.trim(), date, author: '나', views: 0, content: newContent.trim(), comments: [] }
    }));
    setCounter(prev => prev + 1);
    setNewTitle('');
    setNewContent('');
    setView('list');
  };

  useEffect(() => {
    const onBackPress = () => {
      if (view !== 'list') {
        setView('list');
        return true;   // 뒤로가기 동작을 내가 처리했다 알리기
      }
      return false;    // 기본 동작(앱 종료 등) 허용
    };
    const subsriptBackhandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subsriptBackhandler.remove();
  }, [view]);

  const renderPost = ({ item }) => (
    <TouchableOpacity style={[styles.postContainer, item.id === 'announce' && styles.pinnedContainer]} onPress={() => selectPost(item.id)}>
      {item.id === 'announce' && <Text style={styles.pinnedLabel}>공지</Text>}
      <Text style={styles.postTitle}>{item.title}</Text>
      {/*<Text numberOfLines={2} style={styles.postContent}>{item.content}</Text>*/}
      <RenderHTML source={{html:item.content}} />
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>작성일: {item.date}</Text>
        <Text style={styles.metaText}>댓글: {item.comments.length}</Text>
        <Text style={styles.metaText}>조회: {item.views}</Text>
      </View>
    </TouchableOpacity>
  );

  if (view === 'list') {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={postArray}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          // ListHeaderComponent={<Text style={styles.header}>포럼</Text>}
        />
        <TouchableOpacity style={styles.fab} onPress={() => setView('compose')}>
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (view === 'detail') {
    const post = postsData[selectedPostId];
    return (
      <PostDetail post={post} />
    );
  }

  // 글쓰기 화면(오른쪽 하단의 +를 누름)
  return (
    <SafeAreaView style={styles.container}>
      {/*<View style={styles.detailHeader}>*/}
      {/*  <TouchableOpacity onPress={() => setView('list')}><Text style={styles.backBtn}>←</Text></TouchableOpacity>*/}
      {/*  <Text style={styles.header}>글 쓰기</Text>*/}
      {/*</View>*/}
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
          {/*<TextInput*/}
          {/*  style={[styles.input, { height: 200 }]}*/}
          {/*  value={newContent}*/}
          {/*  onChangeText={setNewContent}*/}
          {/*  placeholder="내용을 입력하세요"*/}
          {/*  multiline*/}
          {/*/>*/}
          <RichTextEditor style={[styles.input, { height: 200 }]} height={200} maxLines={100} minHeight={100} onTextChange={e=>setNewContent(e.nativeEvent.text)} />
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setView('list')}>
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
