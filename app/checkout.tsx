import Ionicons from '@expo/vector-icons/Ionicons';
import { useStripe } from '@stripe/stripe-react-native';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { SquircleButton, SquircleView } from 'expo-squircle-view';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import Container from '~/components/container';
import Header from '~/components/header';
import ImageWithSquircle from '~/components/image-with-squircle';

import Text from '~/components/text';
import { client } from '~/core/api/client';
import useShoppingCartStore from '~/core/store';
import { PRIMARY } from '~/core/theme/colors';

interface BookingRequest {
  property_id: string;
  check_in: string | Date;
  check_out: string | Date;
  guest_count: number;
  special_requests: string;
}

// formatted date for back-end 2024-12-15T14:00:00Z
const formattedDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
};

const Checkout = () => {
  const { item, getTotalPrice } = useShoppingCartStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { bottom } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  if (!item) {
    return (
      <View className="flex flex-1 flex-row items-center justify-center">
        <Text variant="body" className="text-center">
          Carrito vacío
        </Text>
      </View>
    );
  }

  const onSubmit = async () => {
    try {
      if (!item) return;

      setIsLoading(true);

      const bookingData: BookingRequest = {
        property_id: item.product,
        check_in: formattedDate(item.startDate as Date),
        check_out: formattedDate(item.endDate as Date),
        guest_count: 1,
        special_requests: '',
      };
      console.log(bookingData);
      const response = await client.post<{
        customerID: string;
        booking_id: string;
        ephemeralKey: string;
        clientSecret: string;
        paymentIntent: string;
      }>('/bookings', bookingData);

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'holidia',
        customerId: response.data.customerID,
        customerEphemeralKeySecret: response.data.ephemeralKey,
        paymentIntentClientSecret: response.data.paymentIntent,
        allowsDelayedPaymentMethods: true,
        returnURL: 'holidia://checkout',
      });
      if (error) {
        console.log('error');
        setIsLoading(false);
      }
      const { error: paymentSheetError } = await presentPaymentSheet();
      if (paymentSheetError) {
        console.log('error');
      } else {
        console.log('payment successful');
        toast.success('Payment successful');
        router.push('/payment-successful');
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="px-4">
          <Header title="Checkout" />
          <SquircleView
            cornerSmoothing={100}
            preserveSmoothing
            borderRadius={24}
            backgroundColor={'#f3f4f6'}
            className="flex flex-row"
            style={{
              overflow: 'hidden',
              padding: 16,
            }}>
            <ImageWithSquircle image={item.image} width={96} height={96} borderRadius={24} />
            <View className="ml-4 flex-1">
              <Text variant="body" className="">
                Propiedad
              </Text>
              <Text variant="body" className="">
                {item.name}
              </Text>
            </View>
          </SquircleView>
          <SquircleView
            className="my-4 bg-white"
            cornerSmoothing={100}
            preserveSmoothing
            borderRadius={24}
            backgroundColor={'#f3f4f6'}
            style={{
              padding: 16,
              overflow: 'hidden',
            }}>
            <Text variant="subtitle" className="">
              Tu viaje
            </Text>
            <View className="mb-4">
              <Text variant="body" className="mb-2">
                Fechas
              </Text>
              <View className="flex flex-row items-center">
                <Ionicons name="calendar-outline" size={20} className="mr-2" />
                <Text variant="body" className="">
                  {format(new Date(item.startDate), 'EEE, MMM d')} {' - '}
                  {format(new Date(item.endDate), 'EEE, MMM d, yyyy')}
                </Text>
              </View>
            </View>
          </SquircleView>
          <SquircleView
            cornerSmoothing={100}
            preserveSmoothing
            borderRadius={24}
            backgroundColor={'#f3f4f6'}
            style={{
              padding: 16,
              overflow: 'hidden',
            }}>
            <Text variant="subtitle" className="">
              Detalles del Precio
            </Text>
            <View className="">
              <View className="my-1 flex flex-row items-center justify-between">
                <Text variant="body" className="">
                  ${item.price_per_night} x {item.days} noches
                </Text>
                <Text variant="body" className="text-center">
                  ${getTotalPrice()}
                </Text>
              </View>
              <View className="my-1 flex flex-row items-center justify-between">
                <Text variant="body" className="">
                  Tarifa de Limpieza
                </Text>
                <Text variant="body" className="text-center">
                  Gratis
                </Text>
              </View>
              <View className="my-1 flex flex-row items-center justify-between">
                <Text variant="body" className="">
                  Tarifa de Servicio
                </Text>
                <Text variant="body" className="text-center">
                  Gratis
                </Text>
              </View>

              <View className="my-2 h-[1px] bg-gray-200"></View>

              <View className="flex flex-row items-center justify-between">
                <Text variant="body" className="text-center">
                  Total (USD)
                </Text>
                <Text variant="body" className="text-center">
                  ${getTotalPrice().toFixed(2)}
                </Text>
              </View>
            </View>
          </SquircleView>
        </View>
      </ScrollView>
      <SquircleButton
        cornerSmoothing={100}
        preserveSmoothing
        borderRadius={24}
        backgroundColor={PRIMARY}
        onPress={onSubmit}
        style={{
          position: 'absolute',
          bottom: bottom + 12,
          left: 0,
          right: 0,
          marginHorizontal: 16,
          paddingVertical: 16,
        }}>
        {isLoading ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <Text variant="button" className="text-center">
            Confirmar y Pagar
          </Text>
        )}
      </SquircleButton>
    </Container>
  );
};

export default Checkout;
