import { Image as ExpoImage } from 'expo-image';
import { ImageStyle, StyleProp } from 'react-native';

type ImageProps = {
  source: string;
  style?: StyleProp<ImageStyle>;
};

const defaultStyles: ImageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: 16,
};

const Image = ({ source, style }: ImageProps) => {
  return (
    <ExpoImage
      source={source}
      style={[defaultStyles, style]}
      placeholder={{
        blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
      }}
      contentFit="cover"
      transition={1000}
    />
  );
};

export default Image;
