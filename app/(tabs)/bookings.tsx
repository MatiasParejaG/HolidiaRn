import { useQuery } from '@tanstack/react-query';
import { FlatList, View } from 'react-native';
import BookingItem from '~/components/bookings/booking-item';
import Container from '~/components/container';
import Header from '~/components/header';
import LoadingIndicator from '~/components/loading-indicator';
import { client } from '~/core/api/client';

const Bookings = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data } = await client.get('/users/bookings');
      return data.bookings;
    },
  });

  if (isLoading) return <LoadingIndicator />;

  return (
    <Container>
      <Header title="Bookings" />
      <FlatList
        data={data}
        renderItem={({ item }) => <BookingItem booking={item} />}
        keyExtractor={(item) => item.id}
        className="h-full"
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default Bookings;
