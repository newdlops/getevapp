import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Pressable, Alert, Linking} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import {formatKoreanDate} from '../utils/dateFormat.ts';

const data = {
  category: '가전/TV',
  time: '1분전',
  imgUri: 'https://image.fmkorea.com/filesn/cache/thumb/20250221/8054942222_70x50.crop.jpg?c=20250221145050',
  title: 'PreSonus Studio 24C (정품)',
  description: '믹서,이펙터 / 인터페이스 / 헤드폰단자 / LINE-IN / XLR / USB타입C / MIDI-IN / MIDI-OUT',
  recommands: 1,
  comments: 2,
  view: 2000,
  price: '다나와/일반 😍 170,100원 (-10%)',
}; // TODO: 데이터 규격은 API를 만들면서 조정한다.


const DealCard = ({ data }) => {

  const handlePress = async () => {
    const url = data.origin_url;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`이 기기에서 이 링크를 열 수 없습니다: ${url}`);
    }
  };

  const Badge = ({ text, style }) => (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.postItem}>
        <Image
          source={{ uri: `https://${data.thumbnail?.substring(2)}` }}
          style={styles.postThumb}
        />
        <View style={styles.postContent}>
          <View style={styles.postHeader}>
            <Badge text={data.category} />
            <Badge text={data.community_name} style={{backgroundColor: 'skyblue'}}/>
          </View>
          <Text style={styles.postTitle} numberOfLines={2}>
            {data.subject}
          </Text>
          <View style={styles.postMetaPrice}>
            <View>
              <Text style={styles.price}>{data.price}</Text>
            </View>
            <View>
              <Text style={styles.postDate}>{formatKoreanDate(data.write_at)}</Text>
            </View>
          </View>
          <View style={styles.postMetaFooter}>
            <View style={styles.metaPill}><Text style={styles.metaText}>추천수 {data.recommend_count}</Text></View>
            <View style={styles.metaPill}><Text style={styles.metaText}>봤어요 {data.view_count}</Text></View>
            <View style={[styles.metaPill, styles.heartPill]}><Text style={styles.metaText}>♥ 관심상품</Text></View>
          </View>
        </View>
      </View>


      {/*<View style={styles.container}>*/}
      {/*  /!* 상단: 카테고리 / 작성 시점 *!/*/}
      {/*  <View style={styles.header}>*/}
      {/*    <Text style={styles.category}>{data.category}</Text>*/}
      {/*    <Text style={styles.time}>{formatKoreanDate(data.write_at)}</Text>*/}
      {/*  </View>*/}

      {/*  /!* 중앙: 이미지 + 상품 정보 *!/*/}
      {/*  <View style={styles.contentRow}>*/}
      {/*    /!* TODO: 썸네일 S3에 받는 작업 *!/*/}
      {/*    <Image*/}
      {/*      source={{ uri: `https://${data.thumbnail?.substring(2)}` }}*/}
      {/*      style={styles.productImage}*/}
      {/*    />*/}

      {/*    <View style={styles.infoContainer}>*/}
      {/*      <Text style={styles.title}>{data.subject}</Text>*/}
      {/*      <Text style={styles.description}>*/}
      {/*        {data.description}*/}
      {/*      </Text>*/}

      {/*      <View style={styles.tagContainer}>*/}
      {/*        /!* 추천수 *!/*/}
      {/*        <View style={styles.tagBox}>*/}
      {/*          <Text style={styles.tagText}>추천수 {data.recommend_count}</Text>*/}
      {/*        </View>*/}
      {/*        /!* 댓글수 *!/*/}
      {/*        /!*<View style={styles.tagBox}>*!/*/}
      {/*        /!*  <Text style={styles.tagText}>댓글수 {data.comments}</Text>*!/*/}
      {/*        /!*</View>*!/*/}
      {/*        /!* 봤어요 *!/*/}
      {/*        <View style={styles.tagBox}>*/}
      {/*          <Text style={styles.tagText}>봤어요 {data.view_count}</Text>*/}
      {/*        </View>*/}
      {/*        <View style={styles.tagBox}>*/}
      {/*          <Text style={styles.tagText}>{data.community_name}</Text>*/}
      {/*        </View>*/}
      {/*      </View>*/}
      {/*    </View>*/}
      {/*  </View>*/}

      {/*  /!* 하단: 좋아요 아이콘 / 가격정보 / 글쓰기 버튼 *!/*/}
      {/*  <View style={styles.footer}>*/}
      {/*    /!* 왼쪽 좋아요 아이콘(하트) *!/*/}
      {/*    <TouchableOpacity style={styles.likeSection}>*/}
      {/*      <Icon name={'heart-outline'} size={18} color={'black'} />/!* TODO: 클릭하면 색깔을 채우도록 하자 *!/*/}
      {/*    </TouchableOpacity>*/}

      {/*    /!* 가격 정보 *!/*/}
      {/*    <Text style={styles.priceText}>*/}
      {/*      {data.price}원*/}
      {/*    </Text>*/}

      {/*  </View>*/}
      {/*</View>*/}
    </Pressable>
  );
};

export default DealCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  postItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    position: 'relative',
    height: 180,
  },
  postThumb: {
    width: 130,
    height: 150,
    backgroundColor: '#e1e1e1',
    borderRadius: 4,
    marginRight: 16,
  },
  postContent: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#e1e3e8',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  storeBadge: {
    backgroundColor: '#f0eff5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff3b30',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postMetaPrice: {
    bottom: 30,
    width:230,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postMetaFooter: {
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaPill: {
    backgroundColor: '#f0f1f5',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#6c757d',
  },
  heartPill: {
    marginLeft: 'auto',
  },
  postDate: {
    fontSize: 12,
    color: '#adb5bd',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     height: 200,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#ececec',
//     backgroundColor: '#fff',
//   },
//   /* 상단: 카테고리 / 작성 시점 */
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   category: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: 'bold',
//   },
//   time: {
//     fontSize: 12,
//     color: '#999',
//   },
//   /* 중앙: 이미지 + 텍스트 정보 */
//   contentRow: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   productImage: {
//     width: 120,
//     height: 80,
//     resizeMode: 'cover',
//     marginRight: 12,
//     borderRadius: 4,
//   },
//   infoContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 4,
//     color: '#222',
//   },
//   description: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   tagContainer: {
//     flexDirection: 'row',
//   },
//   tagBox: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     marginRight: 6,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tagText: {
//     fontSize: 11,
//     color: '#333',
//   },
//   /* 하단: 좋아요 아이콘, 가격정보, 글쓰기 버튼 */
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   likeSection: {
//     marginRight: 8,
//   },
//   likeIcon: {
//     fontSize: 20,
//     color: '#999',
//   },
//   priceText: {
//     flex: 1,
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#6633cc',
//   },
//   writeButton: {
//     borderWidth: 1,
//     borderColor: '#999',
//     borderRadius: 4,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   writeButtonText: {
//     fontSize: 12,
//     color: '#333',
//   },
// });
