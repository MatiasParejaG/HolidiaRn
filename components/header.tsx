import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import Text from './text';

type Props = {
  title: string;
  headerAction?: {
    name: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
};
const Header = ({ title, headerAction }: Props) => {
  const onBack = () => {
    router.back();
  };

  return (
    <View className="mb-4 flex flex-row items-center justify-between px-2">
      <View className="flex flex-row items-center justify-center">
        <Pressable onPress={onBack}>
          <Ionicons name="arrow-back" size={24} />
        </Pressable>
        <Text variant="subtitle" className="mx-2 text-center">
          {title}
        </Text>
      </View>
      {headerAction && (
        <Pressable onPress={headerAction.onPress}>
          <Ionicons name={headerAction.name} size={24} />
        </Pressable>
      )}
    </View>
  );
};

export default Header;
