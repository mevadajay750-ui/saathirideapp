import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format, isToday, isTomorrow } from 'date-fns';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import type { AppIconName } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';

interface DateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  mode: 'date' | 'time';
  minimumDate?: Date;
  error?: string;
  icon?: AppIconName;
}

export function DateTimePicker({
  label,
  value,
  onChange,
  mode,
  minimumDate,
  error,
  icon = mode === 'date' ? Icons.calendar : Icons.time,
}: DateTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  function formatValue(date: Date | null): string {
    if (!date) return mode === 'date' ? 'Select date' : 'Select time';
    if (mode === 'date') {
      if (isToday(date)) return 'Today';
      if (isTomorrow(date)) return 'Tomorrow';
      return format(date, 'EEE, dd MMM yyyy');
    }
    return format(date, 'hh:mm aa');
  }

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selected) onChange(selected);
  };

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.trigger, !!error && styles.triggerError]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.75}
      >
        <AppIcon name={icon} size={IconSize.lg} color={Colors.textSecondary} />
        <Text style={[styles.triggerText, !value && styles.triggerPlaceholder]}>
          {formatValue(value)}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {showPicker && (
        <RNDateTimePicker
          value={value ?? new Date()}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={mode === 'date' ? minimumDate ?? new Date() : undefined}
          onChange={handleChange}
        />
      )}

      {showPicker && Platform.OS === 'ios' && (
        <View style={styles.iosDoneWrap}>
          <TouchableOpacity style={styles.iosDoneBtn} onPress={() => setShowPicker(false)}>
            <Text style={styles.iosDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  triggerError: {
    borderColor: Colors.error,
  },
  triggerText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    flex: 1,
  },
  triggerPlaceholder: {
    color: Colors.textDisabled,
    fontFamily: FontFamily.body,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  iosDoneWrap: {
    alignItems: 'flex-end',
    backgroundColor: Colors.gray50,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  iosDoneBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
  },
  iosDoneText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
});
