import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0288D1',
    secondary: '#6342f5',
    inactiveColor: '#808080',
  },
};

export default customTheme;
