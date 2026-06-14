import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Keyboard,
} from 'react-native';
import { City, searchCities } from '@/data/cities';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon, ScreenWrapper } from '@/components/common';

interface CityPickerProps {
  label: string;
  placeholder?: string;
  value?: City | null;
  onChange: (city: City) => void;
  excludeCityId?: string;
  error?: string;
}

export function CityPicker({
  label,
  placeholder = 'Search city...',
  value,
  onChange,
  excludeCityId,
  error,
}: CityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const results = searchCities(query, excludeCityId);

  const open = useCallback(() => {
    setQuery('');
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    Keyboard.dismiss();
  }, []);

  const handleSelect = useCallback(
    (city: City) => {
      onChange(city);
      close();
    },
    [onChange, close],
  );

  return (
    <>
      <View>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={[styles.trigger, !!error && styles.triggerError]}
          onPress={open}
          activeOpacity={0.75}
        >
          {value ? (
            <View style={styles.triggerContent}>
              <Text style={styles.triggerValue}>{value.name}</Text>
              <Text style={styles.triggerState}>{value.state}</Text>
            </View>
          ) : (
            <Text style={styles.triggerPlaceholder}>{placeholder}</Text>
          )}
          <Text style={styles.triggerIcon}>▾</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={close}
      >
        <ScreenWrapper contentStyle={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={close} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{label}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.searchWrap}>
            <AppIcon name={Icons.search} size={IconSize.md} color={Colors.textMuted} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search city or state..."
              placeholderTextColor={Colors.textDisabled}
              autoCorrect={false}
              clearButtonMode="while-editing"
              returnKeyType="search"
            />
          </View>

          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <AppIcon name={Icons.map} size={IconSize['2xl']} color={Colors.gray400} />
                <Text style={styles.emptyText}>
                  {query.length > 0
                    ? `No cities found for "${query}"`
                    : 'Start typing to search cities'}
                </Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.cityRow,
                  index === results.length - 1 && styles.cityRowLast,
                  value?.id === item.id && styles.cityRowSelected,
                ]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View style={styles.cityRowLeft}>
                  <AppIcon name={Icons.location} size={IconSize.lg} color={Colors.primary} />
                  <View>
                    <Text
                      style={[styles.cityName, value?.id === item.id && styles.cityNameSelected]}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.cityState}>{item.state}</Text>
                  </View>
                </View>
                {value?.id === item.id && (
                  <AppIcon name={Icons.check} size={IconSize.lg} color={Colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </ScreenWrapper>
      </Modal>
    </>
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
    justifyContent: 'space-between',
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
  triggerContent: {
    flex: 1,
  },
  triggerValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  triggerState: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  triggerPlaceholder: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textDisabled,
    flex: 1,
  },
  triggerIcon: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  modal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  cancelBtn: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.primary,
    width: 56,
  },
  modalTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 56,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['4xl'],
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  cityRowLast: {
    marginBottom: 0,
  },
  cityRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  cityRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cityName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  cityNameSelected: {
    color: Colors.primaryDeep,
    fontFamily: FontFamily.bodySemiBold,
  },
  cityState: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing['4xl'],
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
