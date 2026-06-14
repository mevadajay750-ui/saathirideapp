import React from 'react';
import { View, Text } from 'react-native';
import { Colors, FontFamily, BorderRadius } from '@/theme';
import { useNotificationStore } from '@/hooks/useNotificationStore';
import { styles } from './styles';

interface Props {
  count?: number;
}

export function NotificationBadge({ count }: Props) {
  const storeCount = useNotificationStore((s) => s.unreadCount);
  const display = count ?? storeCount;

  if (display === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.count}>{display > 99 ? '99+' : display}</Text>
    </View>
  );
}
