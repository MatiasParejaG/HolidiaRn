import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ResponsiveGrid } from 'react-native-flexible-grid';
import Container from '~/components/container';
import Card from '~/components/favorite/card';
import Header from '~/components/header';
import LoadingIndicator from '~/components/loading-indicator';
import { client } from '~/core/api/client';

const Favorite = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await client.get('/favorites');
      return response.data.favorites;
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading || !data) {
    return <LoadingIndicator />;
  }

  return (
    <Container>
      <Header title="Favorite" />
      <ResponsiveGrid
        data={data as Property[]}
        keyExtractor={(item: Property) => item.id}
        renderItem={({ item }) => <Card property={item} />}
        maxItemsPerColumn={2}
        itemUnitHeight={256}
      />
    </Container>
  );
};

export default Favorite;
