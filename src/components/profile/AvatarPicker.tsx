import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Colors, FontFamily } from '@/theme';

interface Props {
  name: string;
  photoUrl?: string;
  size?: number;
  isUploading?: boolean;
  onPick: (uri: string) => void;
  editable?: boolean;
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function AvatarPicker({
  name,
  photoUrl,
  size = 88,
  isUploading = false,
  onPick,
  editable = true,
}: Props) {
  const handlePick = useCallback(() => {
    if (!editable) return;
    Alert.alert('Change photo', 'Choose a source', [
      {
        text: 'Camera',
        onPress: () =>
          launchCamera({ mediaType: 'photo', quality: 0.8 }, (res) => {
            if (!res.didCancel && res.assets?.[0]?.uri) {
              onPick(res.assets[0].uri);
            }
          }),
      },
      {
        text: 'Photo library',
        onPress: () =>
          launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (res) => {
            if (!res.didCancel && res.assets?.[0]?.uri) {
              onPick(res.assets[0].uri);
            }
          }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [editable, onPick]);

  const radius = size / 2;
  const badgeSize = Math.round(size * 0.32);

  return (
    <TouchableOpacity onPress={handlePick} disabled={!editable || isUploading} activeOpacity={0.8}>
      <View style={[styles.wrap, { width: size, height: size }]}>
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={[styles.image, { width: size, height: size, borderRadius: radius }]}
          />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size, borderRadius: radius }]}>
            <Text style={[styles.initials, { fontSize: Math.round(size * 0.32) }]}>
              {initials(name)}
            </Text>
          </View>
        )}

        {isUploading && (
          <View style={[styles.uploadingOverlay, { borderRadius: radius }]}>
            <ActivityIndicator color={Colors.white} />
          </View>
        )}

        {editable && !isUploading && (
          <View
            style={[
              styles.editBadge,
              {
                width: badgeSize,
                height: badgeSize,
                borderRadius: badgeSize / 2,
                bottom: 0,
                right: 0,
              },
            ]}
          >
            <Text style={{ fontSize: badgeSize * 0.5 }}>✏️</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  image: {
    borderWidth: 2,
    borderColor: Colors.primary200,
  },
  placeholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary200,
  },
  initials: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.white,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});
