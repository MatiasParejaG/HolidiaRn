import { useQuery } from '@tanstack/react-query';
import { FlatList } from 'react-native';
import Container from '~/components/container';
import Card from '~/components/home/card';
import Discovery from '~/components/home/discovery';
import MainHeader from '~/components/home/main-header';
import LoadingIndicator from '~/components/loading-indicator';
import { client } from '~/core/api/client';

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await client.get('/properties');
      return response.data.properties;
    },
  });

  if (!data || isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Container>
      <MainHeader />
      <FlatList
        data={data.reverse()}
        ListHeaderComponent={() => <Discovery properties={data.reverse()} />}
        renderItem={({ item }) => <Card property={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default Home;
