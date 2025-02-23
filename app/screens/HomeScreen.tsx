import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {useAuth} from '../hooks/useAuth';
import Carousel from 'react-native-reanimated-carousel';
import {useSharedValue} from 'react-native-reanimated';
import HotDealBoard from '../components/HotdealBoard.tsx';
import DealCard from '../components/DealCard.tsx';

const defaultDataWith6Colors = Array.from({length: 100}, (v, i) => i);

const HomeScreen: React.FC = () => {
  const {user, logout} = useAuth();
  const scrollOffsetValue = useSharedValue<number>(0);

  return (
    <FlatList
      data={defaultDataWith6Colors}
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
                <Text style={{textAlign: 'center', fontSize: 30}}>{index}</Text>
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
            <View style={{backgroundColor: 'gray', height: 200}}>
              <Text>광고</Text>
            </View>
          ) : (
            <DealCard></DealCard>
          )}
        </View>
      )}
      keyExtractor={item => item}></FlatList>
  );
};

export default HomeScreen;
