import { View } from 'react-native';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { WIDTH } from '~/core/utils/layout';
import Image from '../image';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useRef } from 'react';

type CarouselItemProps = {
  property: Property;
};

const CarouselItem = ({ property }: CarouselItemProps) => {
  const progressValue = useSharedValue<number>(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        index,
        animated: true,
      });
    }
  };

  return (
    <View>
      <Carousel
        ref={carouselRef}
        width={WIDTH - 32}
        height={320}
        data={property.images}
        autoPlay={false}
        scrollAnimationDuration={2000}
        overscrollEnabled={false}
        renderItem={({ item: imageUri }) => {
          return (
            <View className="mx-1">
              <Image source={imageUri} />
            </View>
          );
        }}
        onProgressChange={(_, absosoluteProgress) => {
          progressValue.value = absosoluteProgress;
        }}
      />
      <Animated.View className="absolute bottom-4 w-full">
        <Pagination.Basic
          progress={progressValue}
          data={property.images.map((_property) => ({ color: _property }))}
          activeDotStyle={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 4,
            backgroundColor: 'white',
          }}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 4,
            backgroundColor: '#F3EFE9',
          }}
          containerStyle={{
            paddingVertical: 8,
          }}
          onPress={onPressPagination}
        />
      </Animated.View>
    </View>
  );
};

export default CarouselItem;
