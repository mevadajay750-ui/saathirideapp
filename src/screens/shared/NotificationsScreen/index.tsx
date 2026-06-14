import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, IconSize, Icons } from '@/theme';
import { AppIcon, ScreenWrapper } from '@/components/common';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { useNotificationStore, InAppNotif } from '@/hooks/useNotificationStore';
import { navigateFromNotification } from '@/utils/notificationNavigation';
import type { RootScreenProps } from '@/navigation/types';
import { styles } from './styles';

type Props = RootScreenProps<'Notifications'>;

export default function NotificationsScreen({ navigation }: Props) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const clearAll = useNotificationStore((s) => s.clearAll);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const handlePress = useCallback(
    (notif: InAppNotif) => {
      markRead(notif.id);
      navigateFromNotification(notif);
    },
    [markRead],
  );

  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Notifications{unreadCount > 0 ? ` (${unreadCount})` : ''}
        </Text>
        {notifications.length > 0 ? (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllBtn}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {notifications.length > 0 && (
        <View style={styles.clearBar}>
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notif={item} onPress={handlePress} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppIcon name={Icons.bell} size={IconSize['2xl']} color={Colors.gray400} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyBody}>
              We will notify you when someone requests your ride, when a driver accepts your
              booking, or when it is time to rate a recent journey.
            </Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}
