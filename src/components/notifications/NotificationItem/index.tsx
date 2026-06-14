import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize } from '@/theme';
import { Icons, type AppIconName } from '@/theme/icons';
import { AppIcon } from '@/components/common/AppIcon';
import { InAppNotif } from '@/hooks/useNotificationStore';
import { NotifType } from '@/services/notification.service';
import { styles } from './styles';

interface Props {
  notif: InAppNotif;
  onPress: (notif: InAppNotif) => void;
}

const TYPE_CONFIG: Record<NotifType, { icon: AppIconName; accent: string }> = {
  booking_request: { icon: Icons.bell, accent: Colors.accent },
  booking_confirmed: { icon: Icons.checkCircle, accent: Colors.success },
  booking_declined: { icon: Icons.closeCircle, accent: Colors.error },
  booking_cancelled: { icon: Icons.ban, accent: Colors.error },
  ride_reminder: { icon: Icons.time, accent: Colors.primary },
  rating_prompt: { icon: Icons.starOutline, accent: Colors.accent },
  general: { icon: Icons.megaphone, accent: Colors.gray400 },
};

export function NotificationItem({ notif, onPress }: Props) {
  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.general;
  const timeAgo = formatDistanceToNow(parseISO(notif.receivedAt), {
    addSuffix: true,
  });

  return (
    <TouchableOpacity
      style={[styles.row, !notif.isRead && styles.rowUnread]}
      onPress={() => onPress(notif)}
      activeOpacity={0.8}
    >
      {!notif.isRead && <View style={[styles.accentBar, { backgroundColor: cfg.accent }]} />}

      <View style={[styles.iconWrap, { backgroundColor: `${cfg.accent}18` }]}>
        <AppIcon name={cfg.icon} size={IconSize.lg} color={cfg.accent} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {notif.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {notif.body}
        </Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>

      {!notif.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}
