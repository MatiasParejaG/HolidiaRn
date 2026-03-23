import { router } from 'expo-router';
import { SquircleButton } from 'expo-squircle-view';
import { Image, View } from 'react-native';
import Container from '~/components/container';
import Text from '~/components/text';
import { PRIMARY } from '~/core/theme/colors';

const Welcome = () => {
  return (
    <Container>
      <View className="flex  flex-1 items-center justify-center px-4">
        <View className="flex flex-1 flex-row items-center justify-center">
          <Image
            source={require('assets/logo.png')}
            style={{
              height: 40,
              width: 176,
            }}
          />
        </View>

        <SquircleButton
          backgroundColor={PRIMARY}
          borderRadius={16}
          style={{
            paddingVertical: 16,
            marginTop: 16,
          }}
          onPress={() => {
            router.push('/signup');
          }}
          className="w-full items-center ">
          <Text variant="button" className="text-center">
            Regístrate Gratis
          </Text>
        </SquircleButton>
        <SquircleButton
          borderRadius={16}
          style={{
            paddingVertical: 16,
          }}
          onPress={() => {
            router.push('/login');
          }}
          className="w-full items-center ">
          <Text variant="button" className="text-center text-primary">
            Ya tienes una cuenta? Inicia Sesión
          </Text>
        </SquircleButton>
      </View>
    </Container>
  );
};

export default Welcome;
