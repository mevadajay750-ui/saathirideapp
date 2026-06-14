import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize } from '@/theme';
import { Icons, type AppIconName } from '@/theme/icons';
import { AppIcon } from '@/components/common/AppIcon';
import { InAppNotif } from '@/hooks/useNotificationStore';
import { NotifType } from '@/services/notification.service';

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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
    gap: Spacing.md,
  },
  rowUnread: {
    backgroundColor: Colors.primaryLight,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: BorderRadius.xs,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: { flex: 1, gap: 2 },
  title: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.5,
  },
  time: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    flexShrink: 0,
  },
});
