import React from 'react';
import { Text, TextProps } from 'react-native';
import { TextStyles } from '@/theme/textStyles';

// Usage: <H1>SaathiRide</H1>  <Body>Find a ride</Body>  <Meta>2 hours ago</Meta>

export const Display = ({ style, ...p }: TextProps) => (
  <Text style={[TextStyles.display, style]} {...p} />
);
export const H1 = ({ style, ...p }: TextProps) => <Text style={[TextStyles.h1, style]} {...p} />;
export const H2 = ({ style, ...p }: TextProps) => <Text style={[TextStyles.h2, style]} {...p} />;
export const H3 = ({ style, ...p }: TextProps) => <Text style={[TextStyles.h3, style]} {...p} />;
export const H4 = ({ style, ...p }: TextProps) => <Text style={[TextStyles.h4, style]} {...p} />;
export const Body = ({ style, ...p }: TextProps) => (
  <Text style={[TextStyles.body, style]} {...p} />
);
export const BodyMd = ({ style, ...p }: TextProps) => (
  <Text style={[TextStyles.bodyMedium, style]} {...p} />
);
export const Meta = ({ style, ...p }: TextProps) => (
  <Text style={[TextStyles.meta, style]} {...p} />
);
export const Label = ({ style, ...p }: TextProps) => (
  <Text style={[TextStyles.label, style]} {...p} />
);
export const Price = ({ style, ...p }: TextProps) => (
  <Text style={[TextStyles.price, style]} {...p} />
);
export const Rating = ({ style, ...p }: TextProps) => (
  <Text style={[TextStyles.rating, style]} {...p} />
);
export const Caption = ({ style, ...p }: TextProps) => (
  <Text style={[TextStyles.caption, style]} {...p} />
);
export const LinkText = ({ style, ...p }: TextProps) => (
  <Text style={[TextStyles.link, style]} {...p} />
);
