import { Platform, TextProps, View, ViewProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Pressable } from '@/components/pressable';
import { Text } from '@/components/text';
import { classNames } from '@/utils/class-names';

type HeaderProps = React.PropsWithChildren & ViewProps;

export function Header({ className, children, ...props }: HeaderProps) {
  return (
    <View
      className={classNames(
        'flex-row items-center gap-6 bg-primary p-5',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export function HeaderButton({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  return (
    <Pressable
      hitSlop={16}
      className={classNames('rounded-full p-1', className)}
      {...props}
    >
      {children}
    </Pressable>
  );
}

type HeaderBackButtonProps = Omit<
  React.ComponentProps<typeof Pressable>,
  'children'
>;

export function HeaderBackButton(props: HeaderBackButtonProps) {
  const navigation = useNavigation();

  if (Platform.OS === 'ios') {
    return null;
  }

  return (
    <HeaderButton onPress={navigation.goBack} {...props}>
      <ArrowLeftIcon color={colors.primaryForeground} />
    </HeaderButton>
  );
}

type HeaderText = React.PropsWithChildren & TextProps;

export function HeaderTitle({ className, children, ...props }: HeaderText) {
  return (
    <Text
      className={classNames(
        'text-2xl font-semibold text-primary-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </Text>
  );
}

export function HeaderDescription({
  className,
  children,
  ...props
}: HeaderText) {
  return (
    <Text className={classNames('text-sm text-neutral-200')} {...props}>
      {children}
    </Text>
  );
}
