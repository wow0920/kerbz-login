import { useColorScheme as useSystemColorScheme } from 'react-native';

export const useColorScheme = () => useSystemColorScheme() ?? 'light';
