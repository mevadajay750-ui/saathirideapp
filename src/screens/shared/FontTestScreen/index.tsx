import React from 'react';
import { ScrollView, Text } from 'react-native';
import { TextStyles } from '@/theme/textStyles';
import { styles } from './styles';

// Add this screen temporarily to AuthNavigator to verify fonts.
// Remove after confirming fonts render correctly.

export default function FontTestScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.poppinsBold}>Poppins Bold — SaathiRide</Text>
      <Text style={styles.poppinsSemiBold}>Poppins SemiBold — Share the journey</Text>
      <Text style={styles.poppinsMedium}>Poppins Medium — Ahmedabad to Vadodara</Text>
      <Text style={styles.poppinsRegular}>Poppins Regular — 3 seats available</Text>

      <Text style={styles.interBold}>Inter Bold — ₹250 per seat</Text>
      <Text style={styles.interSemiBold}>Inter SemiBold — Confirmed booking</Text>
      <Text style={styles.interMedium}>Inter Medium — Today at 9:30 AM · 2h 10m</Text>
      <Text style={styles.interRegular}>
        Inter Regular — Maninagar to Alkapuri · Rahul K. · ★ 4.8
      </Text>

      <Text style={[TextStyles.label, styles.tokenSample]}>Label — Section header</Text>
      <Text style={[TextStyles.price, styles.tokenSample]}>₹1,200</Text>
      <Text style={[TextStyles.rating, styles.tokenSample]}>★ 4.9 (128 rides)</Text>
      <Text style={TextStyles.caption}>By continuing you agree to our Terms of Service</Text>
    </ScrollView>
  );
}
