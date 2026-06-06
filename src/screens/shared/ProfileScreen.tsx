import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Button, Avatar } from '@/components/common';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { useAuthStore } from '@/store/auth.store';

export default function ProfileScreen() {
  const { user, setRole, clearAuth } = useAuthStore();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar name={user?.name ?? 'Guest User'} photoUrl={user?.photoUrl} size={72} />
          <Text style={styles.name}>{user?.name ?? 'Guest User'}</Text>
          <Text style={styles.role}>
            {user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'Not signed in'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Switch role</Text>
          <Text style={styles.cardSubtitle}>Use driver or passenger mode from profile settings.</Text>
          <View style={styles.roleButtons}>
            <Button
              label="Driver mode"
              variant={user?.role === 'driver' ? 'primary' : 'outline'}
              onPress={() => setRole('driver')}
              style={styles.roleButton}
            />
            <Button
              label="Passenger mode"
              variant={user?.role === 'passenger' ? 'primary' : 'outline'}
              onPress={() => setRole('passenger')}
              style={styles.roleButton}
            />
          </View>
        </View>

        <Button label="Log out" variant="secondary" onPress={() => clearAuth()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing['2xl'] },
  header: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  name: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginTop: Spacing.base,
  },
  role: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.base,
  },
  roleButtons: { gap: Spacing.sm },
  roleButton: { marginBottom: Spacing.sm },
});
