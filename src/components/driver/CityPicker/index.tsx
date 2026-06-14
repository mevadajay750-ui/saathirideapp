import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Keyboard } from 'react-native';
import { City, searchCities } from '@/data/cities';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon, ScreenWrapper } from '@/components/common';
import { styles } from './styles';

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
