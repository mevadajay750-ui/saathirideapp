import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { Input, Button, ScreenWrapper } from '@/components/common';
import { AvatarPicker } from '@/components/profile/AvatarPicker';
import { VehicleForm, VehicleFormData } from '@/components/profile/VehicleForm';
import { styles } from './styles';
import {
  useProfileData,
  useUpdateProfile,
  useUploadAndSavePhoto,
  useUpsertVehicle,
} from '@/hooks/useProfile';
import { useAuthStore } from '@/store/auth.store';
import type { RootScreenProps } from '@/navigation/types';

const nameSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});
type NameForm = z.infer<typeof nameSchema>;

type Props = RootScreenProps<'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const isDriver = user?.role === 'driver' || user?.role === 'both';

  const { data: profile } = useProfileData();
  const displayUser = profile ?? user;

  const { mutateAsync: updateProfile, isPending: isSavingName } = useUpdateProfile();
  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadAndSavePhoto();
  const { mutateAsync: saveVehicle, isPending: isSavingVehicle } = useUpsertVehicle();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: displayUser?.name ?? '' },
  });

  useEffect(() => {
    if (displayUser?.name) {
      reset({ name: displayUser.name });
    }
  }, [displayUser?.name, reset]);

  const handleSaveName = useCallback(
    async ({ name }: NameForm) => {
      try {
        await updateProfile({ name });
        Alert.alert('Saved', 'Your name has been updated.');
      } catch {
        Alert.alert('Error', 'Failed to save. Please try again.');
      }
    },
    [updateProfile],
  );

  const handlePhotoPick = useCallback(
    async (uri: string) => {
      try {
        await uploadPhoto(uri);
      } catch {
        Alert.alert('Upload failed', 'Could not update photo. Try again.');
      }
    },
    [uploadPhoto],
  );

  const handleSaveVehicle = useCallback(
    async (data: VehicleFormData) => {
      try {
        await saveVehicle(data);
        Alert.alert('Saved', 'Vehicle details updated.');
      } catch {
        Alert.alert('Error', 'Failed to save vehicle. Try again.');
      }
    },
    [saveVehicle],
  );

  return (
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <View style={{ width: 48 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.photoSection}>
            <AvatarPicker
              name={displayUser?.name ?? ''}
              photoUrl={displayUser?.photoUrl}
              size={100}
              isUploading={isUploading}
              onPick={handlePhotoPick}
            />
            <Text style={styles.photoHint}>Tap to change photo</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Full name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Your full name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              )}
            />
            <Button
              label={isSavingName ? 'Saving…' : 'Save name'}
              onPress={handleSubmit(handleSaveName)}
              isLoading={isSavingName}
              disabled={!isDirty}
              variant={isDirty ? 'primary' : 'secondary'}
              size="md"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mobile number</Text>
            <Input
              value={displayUser?.phone ?? ''}
              editable={false}
              hint="Phone number cannot be changed"
            />
          </View>

          {isDriver && (
            <View style={styles.card}>
              <VehicleForm
                vehicle={displayUser?.vehicle}
                onSave={handleSaveVehicle}
                isLoading={isSavingVehicle}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
