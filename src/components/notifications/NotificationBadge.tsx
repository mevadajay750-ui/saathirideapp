import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, BorderRadius } from '@/theme';
import { useNotificationStore } from '@/hooks/useNotificationStore';

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

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  count: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: Colors.white,
    lineHeight: 13,
  },
});
