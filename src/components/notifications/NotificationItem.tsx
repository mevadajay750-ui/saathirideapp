import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { InAppNotif } from '@/hooks/useNotificationStore';
import { NotifType } from '@/services/notification.service';

interface Props {
  notif: InAppNotif;
  onPress: (notif: InAppNotif) => void;
}

const TYPE_CONFIG: Record<NotifType, { emoji: string; accent: string }> = {
  booking_request: { emoji: '🔔', accent: Colors.accent },
  booking_confirmed: { emoji: '✅', accent: Colors.success },
  booking_declined: { emoji: '❌', accent: Colors.error },
  booking_cancelled: { emoji: '🚫', accent: Colors.error },
  ride_reminder: { emoji: '🕐', accent: Colors.primary },
  rating_prompt: { emoji: '⭐', accent: Colors.accent },
  general: { emoji: '📢', accent: Colors.gray400 },
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
        <Text style={styles.icon}>{cfg.emoji}</Text>
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
  icon: { fontSize: 22 },
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
