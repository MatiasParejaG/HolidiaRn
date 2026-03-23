import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Calendar, fromDateId, toDateId, useDateRange } from '@marceloterreiro/flash-calendar';
import { nanoid } from 'nanoid/non-secure';
import { toast } from 'sonner-native';

import { useQuery } from '@tanstack/react-query';
import {
  addMonths,
  differenceInDays,
  isBefore,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { SquircleButton } from 'expo-squircle-view';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Container from '~/components/container';
import Header from '~/components/header';
import LoadingIndicator from '~/components/loading-indicator';
import AmenitiesList from '~/components/property/amenities-list';
import PropertyImage from '~/components/property/property-image';
import Text from '~/components/text';
import { client } from '~/core/api/client';
import { today } from '~/core/constants';
import useShoppingCartStore from '~/core/store';
import { calendarTheme } from '~/core/theme/calendar-theme';
import { PRIMARY } from '~/core/theme/colors';

type Props = {};
const Property = ({}: Props) => {
  const { id } = useLocalSearchParams();

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ['property' + id],
    queryFn: async () => {
      const { data } = await client.get(`/properties/${id}`);
      return data.property;
    },
  });

  const { addItem } = useShoppingCartStore();

  const { calendarActiveDateRanges, onCalendarDayPress } = useDateRange();

  console.log({ calendarActiveDateRanges });

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['60%'], []);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={'close'}
      />
    );
  }, []);

  const calculateDays = () => {
    if (!calendarActiveDateRanges[0]?.startId) return 0;
    if (!calendarActiveDateRanges[0]?.endId) return 1;

    const startDate = new Date(calendarActiveDateRanges[0].startId);
    const endDate = new Date(calendarActiveDateRanges[0].endId);

    return differenceInDays(endDate, startDate) + 1;
  };

  const hasSelectedDates = Boolean(calendarActiveDateRanges[0]?.startId);
  const [calendarMonthId, setCalendarMonthId] = useState(today);

  const nextMonth = () => {
    const month = addMonths(calendarMonthId, 1);
    setCalendarMonthId(toDateId(month));
  };

  const currentDisplayMonth = fromDateId(calendarMonthId);
  const canGoBack =
    !isSameMonth(currentDisplayMonth, today) && !isBefore(currentDisplayMonth, startOfMonth(today));

  const prevMonth = () => {
    if (canGoBack) {
      const month = subMonths(calendarMonthId, 1);
      setCalendarMonthId(toDateId(month));
    }
  };
  if (isLoading || !property) {
    return <LoadingIndicator />;
  }
  const days = calculateDays();
  const totalPrice = days * property.price_per_night;

  return (
    <Container>
      <Header title="Property" />
      <ScrollView className="flex-1 bg-gray-100 p-4">
        <PropertyImage
          imageUrl={property?.images[1]}
          isFavorite={property?.is_favorite}
          rating={5}
        />
        <View className="flex flex-row items-center justify-between">
          <Text variant="subtitle-primary" className="mt-4">
            {property.name}
          </Text>
          <View className="flex flex-row items-center justify-center">
            <Ionicons name="pricetag" size={12} color={PRIMARY} />
            <Text variant="body-primary" className="ml-2">
              ${property.price_per_night} por noche
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center">
          <Ionicons name="location" size={16} color={PRIMARY} />
          <Text variant="body-primary" className="">
            {property.city}, {property.country}
          </Text>
        </View>
        <Text variant="body" className="mt-1 text-gray-700">
          {property.description}
        </Text>
        <AmenitiesList amenities={property.amenities} />
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        index={-1}
        enablePanDownToClose={true}
        enableDynamicSizing={false}>
        <BottomSheetView style={{ flex: 1 }}>
          <View className="my-4 flex flex-row items-center justify-between px-4">
            <View className="flex flex-row items-center justify-center">
              <Ionicons name="wallet" color={PRIMARY} size={24} />
              <Text variant="subtitle" className="mx-4">
                Precio : ${hasSelectedDates ? totalPrice : property.price_per_night}
                {!hasSelectedDates && ' por noche'}
              </Text>
            </View>
          </View>
          <BottomSheetView style={{ flex: 1, paddingHorizontal: 4, position: 'relative' }}>
            <View className="mt-20 flex flex-row justify-between">
              <Pressable onPress={prevMonth} disabled={!canGoBack}>
                <Ionicons name="arrow-back" size={24} color={canGoBack ? PRIMARY : 'gray'} />
              </Pressable>
              <Pressable onPress={nextMonth}>
                <Ionicons name="arrow-forward" size={24} color={PRIMARY} />
              </Pressable>
            </View>

            <Calendar
              calendarMonthId={calendarMonthId}
              calendarActiveDateRanges={calendarActiveDateRanges}
              calendarMinDateId={today}
              onCalendarDayPress={onCalendarDayPress}
              theme={calendarTheme}
            />
            <SquircleButton
              backgroundColor={PRIMARY}
              cornerSmoothing={100}
              onPress={() => {
                bottomSheetRef.current?.close();

                if (!hasSelectedDates || !calendarActiveDateRanges[0]?.startId) {
                  console.log('error: selecciona las fechas porfavor');
                  return;
                }

                const cartItem: ICartItem = {
                  id: 'cart' + nanoid(),
                  image: property.images[0],
                  name: property.name,
                  product: property.id,
                  price_per_night: property.price_per_night,
                  quantity: 1,
                  startDate: calendarActiveDateRanges[0].startId,
                  endDate:
                    calendarActiveDateRanges[0]?.endId ?? calendarActiveDateRanges[0].startId,
                  days: calculateDays(),
                };
                addItem(cartItem);
                bottomSheetRef.current?.close();
              }}
              preserveSmoothing
              className="m-8 flex flex-row items-center justify-center px-4 "
              style={{
                paddingVertical: 16,
                position: 'absolute',
                bottom: -120,
                left: 0,
                right: 0,
              }}
              borderRadius={24}>
              <Ionicons name="checkmark-circle" size={20} color={'white'} />
              <Text variant="button" className="mx-2 text-center">
                Confirmar
              </Text>
            </SquircleButton>
          </BottomSheetView>
        </BottomSheetView>
      </BottomSheet>

      <View className="bottom-0 left-0 right-0 -z-10 mx-4 mt-auto flex flex-row items-center justify-center py-2">
        {hasSelectedDates ? (
          <Pressable
            className="mr-4"
            onPress={() => {
              bottomSheetRef.current?.expand();
            }}>
            <View className="flex flex-row items-center">
              <Ionicons name="pricetag" color={PRIMARY} size={16} />
              <Text variant="body-primary" className="text-center">
                ${totalPrice}
              </Text>
            </View>
            <Text variant="caption" className="text-center underline">
              {days === 1 ? '1 Noche' : `${days} noches`}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            className="mr-4 flex flex-row items-center"
            onPress={() => {
              bottomSheetRef.current?.expand();
            }}>
            <Ionicons name="calendar-outline" size={24} color={PRIMARY} />
            <Text variant="body-primary" className="ml-2 text-center underline">
              Ver Fechas
            </Text>
          </Pressable>
        )}
        <SquircleButton
          onPress={() => {
            toast.success('Property added to cart');
            router.push('/checkout');
          }}
          className="flex-grow"
          backgroundColor={PRIMARY}
          borderRadius={16}
          style={{
            paddingVertical: 16,
            marginVertical: 4,
          }}>
          <Text variant="button" className="text-center">
            Agenda Ahora
          </Text>
        </SquircleButton>
      </View>
    </Container>
  );
};

export default Property;
