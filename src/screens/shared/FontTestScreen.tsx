import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Colors, Spacing } from '@/theme';
import { TextStyles } from '@/theme/textStyles';

// Add this screen temporarily to AuthNavigator to verify fonts.
// Remove after confirming fonts render correctly.

export default function FontTestScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ padding: Spacing.xl }}
    >
      <Text
        style={{
          fontFamily: 'Poppins-Bold',
          fontSize: 28,
          color: Colors.primaryDeep,
          marginBottom: 8,
        }}
      >
        Poppins Bold — SaathiRide
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins-SemiBold',
          fontSize: 20,
          color: Colors.primary,
          marginBottom: 8,
        }}
      >
        Poppins SemiBold — Share the journey
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins-Medium',
          fontSize: 17,
          color: Colors.textPrimary,
          marginBottom: 8,
        }}
      >
        Poppins Medium — Ahmedabad to Vadodara
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 15,
          color: Colors.textSecondary,
          marginBottom: 20,
        }}
      >
        Poppins Regular — 3 seats available
      </Text>

      <Text
        style={{
          fontFamily: 'Inter-Bold',
          fontSize: 17,
          color: Colors.textPrimary,
          marginBottom: 8,
        }}
      >
        Inter Bold — ₹250 per seat
      </Text>
      <Text
        style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: 15,
          color: Colors.textPrimary,
          marginBottom: 8,
        }}
      >
        Inter SemiBold — Confirmed booking
      </Text>
      <Text
        style={{
          fontFamily: 'Inter-Medium',
          fontSize: 15,
          color: Colors.textSecondary,
          marginBottom: 8,
        }}
      >
        Inter Medium — Today at 9:30 AM · 2h 10m
      </Text>
      <Text
        style={{
          fontFamily: 'Inter-Regular',
          fontSize: 15,
          color: Colors.textMuted,
          marginBottom: 20,
        }}
      >
        Inter Regular — Maninagar to Alkapuri · Rahul K. · ★ 4.8
      </Text>

      <Text style={[TextStyles.label, { marginBottom: 8 }]}>Label — Section header</Text>
      <Text style={[TextStyles.price, { marginBottom: 8 }]}>₹1,200</Text>
      <Text style={[TextStyles.rating, { marginBottom: 8 }]}>★ 4.9 (128 rides)</Text>
      <Text style={TextStyles.caption}>By continuing you agree to our Terms of Service</Text>
    </ScrollView>
  );
}
