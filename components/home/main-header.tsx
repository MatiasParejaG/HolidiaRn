import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, View } from 'react-native';
import { PRIMARY } from '~/core/theme/colors';

const MainHeader = () => {
  return (
    <View className="px-4 pb-4">
      <View className="flex flex-row items-center justify-between">
        <Image
          source={require('assets/logo.png')}
          style={{
            height: 20,
            width: 88,
          }}
          resizeMode="contain"
        />
        <Ionicons name="sparkles" size={24} color={PRIMARY} />
      </View>
    </View>
  );
};

export default MainHeader;
