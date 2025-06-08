import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {useAddCommentMutation, useGetCommentsQuery} from '../api/commentApi.ts';
import {formatKoreanDate} from '../utils/dateFormat.ts';


export type Post = {
  id: number;
  title: string;
  date: string;
  author: string;
  view_count: number;
  content: string;
  comments?: {
    author: string;
    time: string;
    text: string;
  }[];
};

const PostDetail = ({post}: {post: Post}) => {
  const [newComment, setNewComment] = useState('');
  const [addComment, { isLoading: isAddLoading, isSuccess: isAddSuccess, error: addError }] = useAddCommentMutation();
  const { data: commentList, error, isLoading } = useGetCommentsQuery(post.id);
  const commentListCheck = () => {
    console.log(commentList);
  }

  const submitComment = async () => {
    if (!newComment.trim()) return;
    console.log('댓글쓰기', post, newComment);
    // setPostsData(prev => ({
    //   ...prev,
    //   [selectedPostId]: {
    //     ...prev[selectedPostId],
    //     comments: [...prev[selectedPostId].comments, { author: '나', time: timestamp, text: newComment.trim() }]
    //   }
    // }));
    await addComment({ postId: post.id, content: newComment })
    setNewComment('');
  }

  const v = {img: {
    resizeMode: 'stretch'
    }}
  if(post == null) return <SafeAreaView style={styles.container}><Text>로딩중입니다.</Text></SafeAreaView>

  return <SafeAreaView style={styles.container}>
    {/*<View style={styles.detailHeader}>*/}
    {/*  <TouchableOpacity onPress={() => setView('list')}><Text style={styles.backBtn}>←</Text></TouchableOpacity>*/}
    {/*  <Text style={styles.header}>글 상세 보기</Text>*/}
    {/*</View>*/}
    <ScrollView>
      <View style={styles.postDetail}>
        <Text style={styles.detailTitle}>{post.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>작성자: {post.user_name}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>작성일: {post.date}</Text>
          <Text style={styles.metaText}>조회: {post.view_count}</Text>
        </View>
        {/*<Text style={styles.detailContent}>{post.content}</Text>*/}
        <RenderHTML contentWidth={300} allowedStyles={['width','height']} source={{html:post.content}} tagsStyles={v}/>
        {/*<TouchableOpacity style={styles.submitCommentBtn} onPress={commentListCheck}>*/}
        {/*  <Text style={styles.submitCommentText}>댓글확인</Text>*/}
        {/*</TouchableOpacity>*/}
        <View style={styles.commentSection}>
          <Text style={styles.commentHeader}>댓글 ({commentList?.length})</Text>
          {commentList?.map((c, idx) => (
            <View key={idx} style={styles.commentBox}>
              <Text style={styles.commentMeta}>{c.author} · {formatKoreanDate(c.created_at as string)}</Text>
              <Text style={styles.commentText}>{c.content}</Text>
            </View>
          ))}
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="댓글을 입력하세요"
              multiline
            />
            <TouchableOpacity style={styles.submitCommentBtn} onPress={submitComment}>
              <Text style={styles.submitCommentText}>등록</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
}

export default PostDetail;


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
  metaRow: { flexDirection: 'row', marginLeft: 12, marginTop: 8 },
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