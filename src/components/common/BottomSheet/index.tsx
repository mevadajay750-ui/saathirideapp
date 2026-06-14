import React, { useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import RNBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

interface BottomSheetProps {
  title?: string;
  snapPoints?: (string | number)[];
  scrollable?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ title, snapPoints = ['50%', '85%'], scrollable = false, onClose, children }, ref) => {
    const sheetRef = useRef<RNBottomSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close(),
    }));

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    const Content = scrollable ? BottomSheetScrollView : BottomSheetView;

    return (
      <RNBottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={onClose}
        handleIndicatorStyle={styles.handle}
        backgroundStyle={styles.background}
      >
        <Content style={scrollable ? styles.scrollContent : undefined}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity
                onPress={() => sheetRef.current?.close()}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          {children}
        </Content>
      </RNBottomSheet>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
