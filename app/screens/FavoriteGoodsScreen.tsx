import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// 아이콘 사용을 위해 설치 후 불러와주세요. (예: yarn add react-native-vector-icons)
// iOS라면 Info.plist, Android라면 gradle 설정 등을 해야 합니다.
import Icon from '@react-native-vector-icons/ionicons';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../store/authSlice.ts';
import {useIsFocused} from '@react-navigation/native';
import LoginRequest from '../components/LoginRequest.tsx';

// 예시 상품 데이터
const initialData = [
  {
    id: '1',
    title: 'Pull and deer',
    brand: 'Fancy',
    price: 234.9,
    imageUri:
      'https://image.fmkorea.com/filesn/cache/thumb/20250221/8054942222_70x50.crop.jpg?c=20250221145050',
    isLiked: false,
  },
  {
    id: '2',
    title: 'Gabriel',
    brand: 'Coco',
    price: 500,
    imageUri: 'https://via.placeholder.com/200x250/FFC0CB?text=Fashion2',
    isLiked: false,
  },
  {
    id: '3',
    title: 'Prada',
    brand: 'Black deem',
    price: 344.89,
    imageUri: 'https://via.placeholder.com/200x250/808080?text=Fashion3',
    isLiked: false,
  },
  {
    id: '4',
    title: 'Brown tight',
    brand: 'Bear',
    price: 234.9,
    imageUri: 'https://via.placeholder.com/200x250/B5651D?text=Fashion4',
    isLiked: false,
  },
  {
    id: '5',
    title: 'Blue candy',
    brand: 'MMT',
    price: 500,
    imageUri: 'https://via.placeholder.com/200x250/87CEEB?text=Fashion5',
    isLiked: false,
  },
  {
    id: '6',
    title: 'ZIZI',
    brand: 'Basic mint',
    price: 344.89,
    imageUri: 'https://via.placeholder.com/200x250/008080?text=Fashion6',
    isLiked: false,
  },
];

const FavoriteGoodsScreen = ({navigation}) => {
  // 상품 목록 상태
  const [products, setProducts] = useState(initialData);

  const currentUser = useSelector(selectCurrentUser);
  const isFocused = useIsFocused();
  useEffect(() => {
    // if (!currentUser.isLogged) navigation.navigate('AuthStack');
  }, [currentUser, isFocused]);

  // 찜하기(좋아요) 상태 토글 함수
  const toggleLike = id => {
    setProducts(prev =>
      prev.map(item =>
        item.id === id ? {...item, isLiked: !item.isLiked} : item,
      ),
    );
  };

  // 개별 상품 카드를 렌더링하는 함수
  const renderItem = ({item}) => (
    <View style={styles.cardContainer}>
      <Image source={{uri: item.imageUri}} style={styles.productImage} />

      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productBrand}>{item.brand}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>

      {/* 하트 아이콘 (좋아요 / 해제) */}
      <TouchableOpacity
        style={styles.likeButton}
        onPress={() => toggleLike(item.id)}>
        <Icon
          name={item.isLiked ? 'heart' : 'heart-outline'}
          size={24}
          color={item.isLiked ? 'red' : '#888'}
        />
      </TouchableOpacity>
    </View>
  );

  return currentUser.isLogged ? (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      numColumns={2} // 2열 배치
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContainer}
    />
  ) : (
    <LoginRequest onLoginPress={()=>navigation.navigate('AuthStack')}></LoginRequest>
  );
};

export default FavoriteGoodsScreen;

// 스타일 정의
const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    padding: 12,
    borderRadius: 8,
    // 카드 형태로 보이도록 그림자/섀도우 효과
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // 안드로이드 그림자
  },
  productImage: {
    width: '100%',
    aspectRatio: 0.8, // 이미지 비율
    marginBottom: 8,
    borderRadius: 4,
    resizeMode: 'cover',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#7C3AED',
    marginBottom: 8,
  },
  likeButton: {
    position: 'absolute',
    bottom: 16,
    right: 12,
  },
});
