import React from 'react';
import { View, Text } from 'react-native';
import { TextStyles, CommonStyles } from '@/theme';
import { AppLogo, Button, ScreenWrapper } from '@/components/common';
import type { AuthScreenProps } from '@/navigation/types';
import { styles } from './styles';

type Props = AuthScreenProps<'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <ScreenWrapper contentStyle={styles.safe}>
      <View style={styles.container}>
        {/* Hero area */}
        <View style={[CommonStyles.centerFlex, styles.hero]}>
          {/* Logo mark */}
          <View style={styles.logoMark}>
            <AppLogo size={64} borderRadius={16} />
          </View>

          {/* App name */}
          <Text style={styles.appName}>SaathiRide</Text>
          <Text style={styles.tagline}>Share the journey</Text>

          {/* Illustration placeholder */}
          <View style={styles.illustration} />

          {/* Hero copy */}
          <Text style={styles.heroTitle}>Travel smarter,{'\n'}share the ride</Text>
          <Text style={styles.heroSubtitle}>
            Connect with drivers going your way on any intercity route. Comfortable travel, shared
            costs.
          </Text>
        </View>

        {/* CTA footer */}
        <View style={styles.footer}>
          <Button
            label="Create account"
            onPress={() => navigation.navigate('Phone', { intent: 'signup' })}
            variant="primary"
            size="lg"
          />

          <View style={[CommonStyles.row, styles.loginRow]}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Button
              label="Sign in"
              onPress={() => navigation.navigate('Phone', { intent: 'login' })}
              variant="ghost"
              size="sm"
              fullWidth={false}
            />
          </View>

          <Text style={TextStyles.caption}>
            By continuing you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}
