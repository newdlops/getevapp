import React, {useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useSharedValue} from 'react-native-reanimated';
import HotDealBoard from '../components/HotdealBoard.tsx';
import DealCard from '../components/DealCard.tsx';
import {useGetDealsInfiniteQuery} from '../api/dealApi.ts';
import Svg, {Circle, Polyline} from 'react-native-svg';

const defaultDataWith6Colors = Array.from({length: 100}, (v, i) => i);

const HomeScreen: React.FC = () => {
  const scrollOffsetValue = useSharedValue<number>(0);
  const {
    data,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetDealsInfiniteQuery()

  //권장되는 방법
  const deals = React.useMemo(
    () => data?.pages.flatMap(page => page.results) ?? [],
    [data]
  );
  const [showFAB, setShowFAB] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const scrollUp = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowFAB(offsetY > 1200);  // 1200px 이상 스크롤 시 보여줌
  };

  return (
    <View>
      <FlatList
        onScroll={handleScroll}
        ref={flatListRef}
        data={deals}
        ListHeaderComponent={() => (
          <View id="carousel-component">
            <Carousel
              testID={'xxx'}
              loop={true}
              width={430}
              height={136}
              snapEnabled={true}
              pagingEnabled={true}
              autoPlayInterval={2000}
              data={defaultDataWith6Colors}
              defaultScrollOffsetValue={scrollOffsetValue}
              style={{width: '100%'}}
              onScrollStart={() => {
                console.log('Scroll start');
              }}
              onScrollEnd={() => {
                console.log('Scroll end');
              }}
              onConfigurePanGesture={g => {
                'worklet';
                g.enabled(false);
                g.activeOffsetX([-10, 10]);
              }}
              onSnapToItem={(index: number) =>
                console.log('current index:', index)
              }
              renderItem={({index}) => (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    justifyContent: 'center',
                  }}>
                  <Text style={{textAlign: 'center', fontSize: 30}}>
                    {index}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
        renderItem={({item, index}) => (
          <View style={{backgroundColor: item, marginBottom: 10}}>
            {index % 8 === 0 ? (
              <HotDealBoard></HotDealBoard>
            ) : index % 8 === 4 ? (
              <View style={{backgroundColor: 'gray', height: 180}}>
                <Text>광고</Text>
              </View>
            ) : (
              <DealCard data={item}></DealCard>
            )}
          </View>
        )}
        keyExtractor={(item: any, index) => item.article_id}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        // 2) 리스트 길이의 50% 지점에서 onEndReached 트리거
        onEndReachedThreshold={0.5}
        // 3) 로딩 인디케이터 및 "끝" 메시지 표시
        ListFooterComponent={
          isFetchingNextPage ? (
            <></>
          ) : !hasNextPage ? (
            <Text style={{textAlign: 'center', padding: 10}}>
              마지막 데이터입니다.
            </Text>
          ) : null
        }
        onRefresh={() => refetch()}
        refreshing={isFetching}></FlatList>
      {showFAB &&
        <TouchableOpacity style={styles.fab} onPress={scrollUp}>
          {/*<Text style={styles.fabIcon}>▲</Text>*/}
          <Svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            role="img"
            aria-label="위로가기 버튼">
            <Circle cx="12" cy="12" r="10" fill="#8e44ad" opacity="0.5" />
            <Polyline
              points="8 14 12 10 16 14"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      }
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  fab: { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#8e44ad', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabIcon: { color: '#fff', fontSize: 32 }
  });