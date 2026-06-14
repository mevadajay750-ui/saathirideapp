import React from 'react';
import { View, Text } from 'react-native';
import { Colors, IconSize, AppIconName } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { styles } from './styles';

interface Props {
  icon: AppIconName;
  value: string | number;
  label: string;
}

export function StatCard({ icon, value, label }: Props) {
  return (
    <View style={styles.card}>
      <AppIcon name={icon} size={IconSize.lg} color={Colors.primary} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
