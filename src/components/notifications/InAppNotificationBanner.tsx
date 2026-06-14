import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadow, IconSize, Icons } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { NotifPayload, setForegroundNotifHandler } from '@/services/notification.service';
import { navigateFromNotification } from '@/utils/notificationNavigation';

const BANNER_DURATION_MS = 4000;

export function InAppNotificationBanner() {
  const [current, setCurrent] = useState<NotifPayload | null>(null);
  const slideAnim = useMemo(() => new Animated.Value(-120), []);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 280,
      useNativeDriver: true,
    }).start(() => setCurrent(null));
  }, [slideAnim]);

  const show = useCallback(
    (payload: NotifPayload) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setCurrent(payload);

      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 200,
      }).start();

      timerRef.current = setTimeout(dismiss, BANNER_DURATION_MS);
    },
    [slideAnim, dismiss],
  );

  useEffect(() => {
    setForegroundNotifHandler(show);
    return () => setForegroundNotifHandler(() => {});
  }, [show]);

  if (!current) return null;

  const handleTap = () => {
    dismiss();
    navigateFromNotification(current);
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      pointerEvents="box-none"
    >
      <SafeAreaView edges={['top']}>
        <TouchableOpacity style={styles.banner} onPress={handleTap} activeOpacity={0.92}>
          <View style={styles.left}>
            <View style={styles.appIcon}>
              <AppIcon name={Icons.carSport} size={IconSize.lg} color={Colors.primary} />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.title} numberOfLines={1}>
                {current.title}
              </Text>
              <Text style={styles.body} numberOfLines={2}>
                {current.body}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={dismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <AppIcon name={Icons.close} size={IconSize.lg} color={Colors.textMuted} />
          </TouchableOpacity>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: Spacing.base,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.borderBrand,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.modal,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: { flex: 1 },
  title: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: FontSize.sm * 1.4,
  },
});
