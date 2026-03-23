import { router } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { SquircleButton } from 'expo-squircle-view';
import { useState } from 'react';
import { ActivityIndicator, Image, TextInput, View } from 'react-native';
import { toast } from 'sonner-native';
import Container from '~/components/container';
import Header from '~/components/header';
import Text from '~/components/text';
import { client } from '~/core/api/client';
import useAuth from '~/core/auth';
import { PRIMARY } from '~/core/theme/colors';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      if (!email || !password || !name) {
        console.log('Todos los campos son requeridos');
        return;
      }
      setIsLoading(true);
      const signUpResponse = await client.post('/users', {
        name,
        email,
        password,
      });
      console.log(signUpResponse.data);
      const loginResponse = await client.post<{ token: string; user: User }>('users/login', {
        email,
        password,
      });
      setUser(loginResponse.data.user);
      console.log(loginResponse.data);

      signIn({
        access: loginResponse.data.token,
      });
      setIsLoading(false);
      router.push('/');
      toast.success('Bienvenido a Holidia');
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={4} style={{ flex: 1 }}>
        <Header title="Sign Up" />
        <View className="flex-1 px-4">
          <View className="mt-24 flex flex-row items-center justify-center">
            <Image
              source={require('assets/logo.png')}
              style={{ height: 40, width: 176 }}
              resizeMode="contain"
            />
          </View>
          <Text variant="subtitle-primary" className="mt-4 text-center">
            Empieza tu viaje
          </Text>
          <TextInput
            className="mt-4 rounded-xl bg-gray-100 px-4 py-6"
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="mt-4 rounded-xl bg-gray-100 px-4 py-6"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            className="mt-4 rounded-xl bg-gray-100 px-4 py-6"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
          />

          <SquircleButton
            className="mt-auto"
            preserveSmoothing
            cornerSmoothing={100}
            borderRadius={16}
            onPress={handleRegister}
            style={{
              backgroundColor: PRIMARY,
              paddingVertical: 16,
            }}>
            {isLoading ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <Text variant="button" className="text-center">
                Registrarse
              </Text>
            )}
          </SquircleButton>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Signup;
