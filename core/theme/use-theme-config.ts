import { Theme } from '@react-navigation/native';
import { DefaultTheme } from '@react-navigation/native';

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

export default theme;
