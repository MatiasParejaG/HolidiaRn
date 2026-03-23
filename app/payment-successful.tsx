import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { SquircleButton } from 'expo-squircle-view';
import { MotiView } from 'moti';
import { View } from 'react-native';
import Container from '~/components/container';
import Text from '~/components/text';

const PaymentSuccessful = () => {
  return (
    <Container>
      <View className="flex-1 items-center justify-center p-5">
        <MotiView
          from={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            duration: 1000,
            scale: {
              damping: 12,
              stiffness: 100,
            },
          }}>
          <View className="flex h-24 w-24 flex-row items-center justify-center rounded-full bg-green-100 ">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-green-600">
              <Ionicons name="checkmark" size={40} color={'white'} />
            </View>
          </View>
        </MotiView>

        <Text variant="display" className="my-4 text-center">
          Payment Successful
        </Text>
        <Text variant="body" className="mb-10 text-center text-gray-600">
          Your booking has been confirmed.
        </Text>

        <View className="flex flex-row items-center justify-center">
          <SquircleButton
            backgroundColor={'green'}
            className="w-full"
            cornerSmoothing={100}
            preserveSmoothing
            onPress={() => {
              router.push('/(tabs)/bookings');
            }}
            borderRadius={16}
            style={{
              paddingVertical: 16,
            }}>
            <Text variant="button" className="text-center">
              View my bookings
            </Text>
          </SquircleButton>
        </View>
      </View>
    </Container>
  );
};

export default PaymentSuccessful;
