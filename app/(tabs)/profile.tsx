import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';

import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';
import { SquircleView } from 'expo-squircle-view';
import { View } from 'react-native';
import Container from '~/components/container';
import Header from '~/components/header';
import ImageWithSquircle from '~/components/image-with-squircle';
import LoadingIndicator from '~/components/loading-indicator';
import Text from '~/components/text';
import { client } from '~/core/api/client';
import useAuth from '~/core/auth';
import { PRIMARY } from '~/core/theme/colors';

type UserStat = {
  name: string;
  email: string;
  username: string;
  favorite_properties_count: number;
  bookings_count: number;
  avatar: string;
};

const Profile = () => {
  const { signOut, user } = useAuth();

  const { data, isLoading, refetch } = useQuery<UserStat>({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await client.get('users/stats');
      return response.data.stats;
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading || !user || !data) {
    return <LoadingIndicator />;
  }
  console.log(data);

  return (
    <Container>
      <Header
        title="Profile"
        headerAction={{
          name: 'log-out',
          onPress: () => {
            signOut();
          },
        }}
      />
      <View className="flex flex-row items-center justify-center">
        <ImageWithSquircle image={user.avatar} width={256} height={256} borderRadius={48} />
      </View>
      <View className="mt-4 flex items-center">
        <Text variant="subtitle" className="text-center">
          {user.email}
        </Text>
        <Text variant="subtitle" className="text-center">
          @{user.username}
        </Text>
      </View>
      <SquircleView className="m-4 mt-10 flex flex-row flex-wrap justify-around">
        <View>
          <View className="flex flex-row items-center justify-center rounded-xl bg-gray-100 p-8">
            <Ionicons name="stats-chart" color={PRIMARY} size={40} />
          </View>
          <View className="mt-4 flex flex-row items-center justify-center">
            <Text variant="body" className="text-center">
              Viajes
            </Text>
            <Text variant="body" className="mx-4 text-center">
              {data.bookings_count}
            </Text>
          </View>
        </View>
        <View>
          <View className="flex flex-row items-center justify-center rounded-xl bg-gray-100 p-8">
            <Ionicons name="heart" color={PRIMARY} size={40} />
          </View>
          <View className="mt-4 flex flex-row items-center justify-center">
            <Text variant="body" className="text-center">
              Favoritos
            </Text>
            <Text variant="body" className="mx-4 text-center">
              {data.favorite_properties_count}
            </Text>
          </View>
        </View>
        <View>
          <View className="flex flex-row items-center justify-center rounded-xl bg-gray-100 p-8">
            <Ionicons name="albums" color={PRIMARY} size={40} />
          </View>
          <View className="mt-4 flex flex-row items-center justify-center">
            <Text variant="body" className="text-center">
              Albums
            </Text>
            <Text variant="body" className="mx-4 text-center">
              4
            </Text>
          </View>
        </View>
      </SquircleView>
    </Container>
  );
};

export default Profile;
