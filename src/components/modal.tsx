import * as React from 'react';
import { Modal as NativeModal, Pressable, View } from 'react-native';
import { XIcon } from 'lucide-react-native';

import { classNames } from '@/utils/class-names';

export function Modal({
  visible,
  onClose,
  children,
  ...props
}: React.ComponentProps<typeof NativeModal> & {
  onClose?: () => void;
}): React.ReactElement {
  return (
    <NativeModal
      visible={visible}
      statusBarTranslucent
      transparent
      // I prefer to use fade animation because we use a lot of modal in sequence
      // and it looks better when transitioning between them.
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      {children}
    </NativeModal>
  );
}

export function ModalBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      className={classNames(
        'absolute bottom-0 left-0 right-0 top-0 bg-black/60',
        className,
      )}
      {...props}
    />
  );
}

export function ModalContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <>
      <ModalBackdrop />
      <View
        className={classNames(
          'absolute left-5 right-5 top-1/2 -translate-y-1/2 rounded-2xl bg-card',
          className,
        )}
        onTouchEnd={() => {}}
        {...props}
      >
        {children}
      </View>
    </>
  );
}

export function ModalCloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable hitSlop={20} onPress={onPress}>
      <XIcon color="#555" />
    </Pressable>
  );
}
