import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

// 더미 데이터 예시
const hotDeals = [
  {
    id: '1',
    title: '[네이버페이] 일일적립, 클릭 15원, 랜덤포인트 3회',
  },
  {
    id: '2',
    title: '[스팀] 초탐정사건부 레인코드+단간론파 번들 [47,000원 → 20,000원]',
  },
  {
    id: '3',
    title: '[스팀] 스팀 주간할인 게임들',
  },
];

// "실시간 인기핫딜" 게시판
const HotDealBoard = () => {

  // 리스트 개별 아이템 렌더링
  const renderHotDealItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => {/* 상세 페이지 이동 등 구현 */}}>
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  // const [count, setCount] = useState(0);
  // useEffect(() => {
  //   // 1초마다 count를 +1 증가시키는 interval
  //   const intervalId = setInterval(() => {
  //     setCount(prevCount => prevCount + 1);
  //   }, 1000);
  //
  //   // 컴포넌트가 언마운트될 때 interval 해제
  //   return () => clearInterval(intervalId);
  // }, []);
  // TODO: 실시간 핫딜차트 보여줄때 쓸지 고민해보자


  return (
    <View style={styles.container}>
      {/* 상단 타이틀 */}
      <Text style={styles.title}>실시간 인기핫딜</Text>

      {/* 핫딜 목록 */}
      <FlatList
        data={hotDeals}
        keyExtractor={(item) => item.id}
        renderItem={renderHotDealItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default HotDealBoard;

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    height: 180,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemContainer: {
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#000',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
