import { ActivityIndicator, View } from 'react-native';

import { PRIMARY } from '~/core/theme/colors';
import Container from './container';

const LoadingIndicator = () => {
  return (
    <Container>
      <View className="flex flex-1 flex-row items-center justify-center">
        <ActivityIndicator size={'large'} color={PRIMARY} />
      </View>
    </Container>
  );
};

export default LoadingIndicator;
