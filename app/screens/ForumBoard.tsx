// ForumBoard.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';

// 게시글 컴포넌트
const Post = ({ post, onPress }) => (
  <TouchableOpacity
    style={[styles.postContainer, post.isNotice && styles.noticeContainer]}
    onPress={() => onPress(post)}
  >
    <Text style={[styles.postTitle, post.isNotice && styles.noticeText]}>
      {post.isNotice ? '[공지] ' : ''}{post.title}
    </Text>
    <Text style={styles.postDate}>{post.date}</Text>
  </TouchableOpacity>
);

// 댓글 컴포넌트
const Comment = ({ comment, onReply }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  return (
    <View style={[styles.commentContainer, { marginLeft: comment.depth * 20 }]}>
      <Text style={styles.commentText}>{comment.text}</Text>
      <Text style={styles.commentInfo}>{comment.author} • {comment.date}</Text>

      <TouchableOpacity
        style={styles.replyButton}
        onPress={() => setShowReplyInput(!showReplyInput)}
      >
        <Text style={styles.replyButtonText}>답글</Text>
      </TouchableOpacity>

      {showReplyInput && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            value={replyText}
            onChangeText={setReplyText}
            placeholder="답글을 입력하세요"
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              onReply(comment.id, replyText);
              setReplyText('');
              setShowReplyInput(false);
            }}
          >
            <Text style={styles.submitButtonText}>등록</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// 게시글 상세 화면
const PostDetail = ({ post, onClose }) => {
  const [commentText, setCommentText] = useState('');

  const addComment = () => {
    // 댓글 추가 로직 구현
    setCommentText('');
  };

  return (
    <View style={styles.detailContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>뒤로</Text>
      </TouchableOpacity>

      <Text style={styles.detailTitle}>{post.title}</Text>
      <Text style={styles.detailContent}>{post.content}</Text>
      <Text style={styles.detailInfo}>{post.author} • {post.date}</Text>

      <View style={styles.commentSection}>
        <TextInput
          style={styles.commentInput}
          value={commentText}
          onChangeText={setCommentText}
          placeholder="댓글을 입력하세요"
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={addComment}
        >
          <Text style={styles.submitButtonText}>등록</Text>
        </TouchableOpacity>

        <FlatList
          data={post.comments}
          renderItem={({ item }) => (
            <Comment
              comment={item}
              onReply={(commentId, replyText) => {
                // 대댓글 추가 로직 구현
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </View>
  );
};

// 메인 포럼 보드 컴포넌트
const ForumBoard = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts] = useState([
    {
      id: 1,
      isNotice: true,
      title: '포럼 이용 규칙 안내',
      content: '포럼 이용 규칙입니다...',
      author: '관리자',
      date: '2024-02-23',
      comments: []
    },
    {
      id: 2,
      title: '안녕하세요, 가입인사 드립니다',
      content: '잘 부탁드립니다...',
      author: '사용자1',
      date: '2024-02-23',
      comments: [
        {
          id: 1,
          text: '환영합니다!',
          author: '사용자2',
          date: '2024-02-23',
          depth: 0
        }
      ]
    },
    // 더미 데이터...
  ]);

  return (
    <View style={styles.container}>
      {selectedPost ? (
        <PostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <Post post={item} onPress={setSelectedPost} />
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noticeContainer: {
    backgroundColor: '#f8f9fa',
  },
  postTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  noticeText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  postDate: {
    fontSize: 12,
    color: '#666',
  },
  detailContainer: {
    flex: 1,
    padding: 15,
  },
  closeButton: {
    marginBottom: 15,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailContent: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
  detailInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  commentSection: {
    marginTop: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  commentContainer: {
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
    marginBottom: 10,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 5,
  },
  commentInfo: {
    fontSize: 12,
    color: '#666',
  },
  replyButton: {
    marginTop: 5,
  },
  replyButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  replyInputContainer: {
    marginTop: 10,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    marginBottom: 5,
  },
});

export default ForumBoard;
