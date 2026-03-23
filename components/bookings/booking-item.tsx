import { format } from 'date-fns';
import { View } from 'react-native';

import Ionicons from '@expo/vector-icons/build/Ionicons';
import { BlurView } from 'expo-blur';
import { SquircleView } from 'expo-squircle-view';
import { useImageColors } from '~/core/hooks/use-image-colors';
import Image from '../image';
import Text from '../text';

type Props = {
  booking: Booking;
};

const CalendarDate = ({ date = new Date() }) => {
  const month = format(date, 'MMM').toUpperCase();
  const day = format(date, 'd').toUpperCase();
  const weekday = format(date, 'EEE').toUpperCase();

  return (
    <SquircleView
      cornerSmoothing={100}
      preserveSmoothing
      backgroundColor={'#f3f4f6'}
      borderRadius={16}
      style={{
        paddingVertical: 4,
        paddingHorizontal: 4,
      }}>
      <View className="mx-1 flex flex-row items-center justify-center">
        <Text variant="caption" className="text-center">
          {month}
        </Text>
      </View>
      <View className="items-center py-2">
        <Text variant="subtitle" className="text-center">
          {day}
        </Text>
      </View>
      <View className="items-center p-1">
        <Text variant="caption" className="text-center text-gray-500">
          {weekday}
        </Text>
      </View>
    </SquircleView>
  );
};

const BookingItem = ({ booking }: Props) => {
  const { colors } = useImageColors(booking.property.images[0]);

  return (
    <View className="mx-4 flex flex-row justify-between">
      <View className="mr-4">
        <CalendarDate date={booking.check_in as unknown as Date} />
      </View>
      <SquircleView
        className="flex-1"
        cornerSmoothing={100}
        preserveSmoothing
        borderRadius={24}
        style={{
          overflow: 'hidden',
        }}>
        <SquircleView
          borderRadius={24}
          style={{ overflow: 'hidden', borderBottomEndRadius: 0, borderBottomStartRadius: 0 }}>
          <View className="h-36 overflow-hidden">
            <Image source={booking.property.images[0]} style={{ height: 256 }} />
          </View>
          <SquircleView
            cornerSmoothing={100}
            preserveSmoothing
            style={{
              padding: 24,
              position: 'relative',
              backgroundColor: colors?.secondary,
              overflow: 'hidden',
            }}>
            <BlurView
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
              tint="dark"
              intensity={20}
            />
            <View className="flex flex-row items-center">
              <Ionicons name="location" size={16} color={'white'} />
              <Text variant="body" className="mx-2 text-white">
                {booking.property.name},{booking.property.city},{booking.property.country}
              </Text>
            </View>

            <View className="mt-2 flex flex-row justify-between">
              <View className="">
                <Text variant="body" className="text-white">
                  Check-in
                </Text>
                <Text variant="body" className="text-white">
                  {format(new Date(booking.check_in), 'MMM dd, yyyy')}
                </Text>
              </View>
              <View className="">
                <Text variant="body" className="text-white">
                  Check-out
                </Text>
                <Text variant="body" className="text-white">
                  {format(new Date(booking.check_out), 'MMM dd, yyyy')}
                </Text>
              </View>
            </View>
          </SquircleView>
        </SquircleView>
      </SquircleView>
    </View>
  );
};

export default BookingItem;
