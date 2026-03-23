import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { View } from 'react-native';
import Image from '../image';

type Props = {
  property: Property;
};
const Card = ({ property }: Props) => {
  return (
    <View className="flex-1 p-2">
      <Image source={property.images[0]} />
      <BlurView
        className="absolute bottom-4 right-4 overflow-hidden rounded-xl p-2"
        intensity={80}
        tint="light">
        <Ionicons name="heart" color={'white'} size={24} />
      </BlurView>
    </View>
  );
};

export default Card;
