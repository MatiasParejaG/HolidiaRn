import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import Container from '~/components/container';
import Header from '~/components/header';
import LoadingIndicator from '~/components/loading-indicator';
import Card from '~/components/search/card';
import { client } from '~/core/api/client';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties-search', debouncedSearchQuery],
    queryFn: async () => {
      if (debouncedSearchQuery) {
        const { data } = await client.get(`/properties/search?city=${debouncedSearchQuery}`);
        return data.properties;
      } else {
        return [];
      }
    },
    staleTime: 1000 * 60,
  });

  console.log(properties);

  return (
    <Container>
      <Header title="Search" />

      <View className="mx-4 flex flex-row items-center justify-center rounded-xl bg-gray-100 px-4 py-2">
        <View className="flex flex-row items-center justify-center py-3">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            className="ml-2 flex-1"
            placeholder="Busca por ciudad..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      <FlatList
        data={properties}
        renderItem={({ item }) => <Card property={item} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isLoading ? <LoadingIndicator /> : null}
      />
    </Container>
  );
};

export default Search;
