import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { getColors } from '../styles/global_styles';
import DropdownRoundButton from '../components/DropdownRoundButton';
import { useRouter } from 'expo-router';

export default function Gallery() {
  const theme = useColorScheme();
  const colors = getColors(theme);
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}> 
      <Text style={[styles.title, { color: colors.black }]}>Galería</Text>

      <DropdownRoundButton elements={[{
          label: 'Crear Presupuesto',
          callback: () => {router.push('/create_budget')}
        },
        {
          label: 'Acerca de nosotros',
          callback: () => {router.push('/about')}
        }
        ]}>
      </DropdownRoundButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
  }
});