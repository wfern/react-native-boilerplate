import { View } from 'react-native';

import { Text } from '@/components/text';
import { classNames } from '@/utils/class-names';

export function DefinitionListLabel({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={classNames('mb-2 px-5 text-xl font-semibold', className)}
      {...props}
    />
  );
}

export function DefinitionList({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      className={classNames(
        'rounded-2xl border border-card-border bg-card p-5',
        className,
      )}
      {...props}
    />
  );
}

export function DefinitionListTitle({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={classNames('leading-tight', className)} {...props}>
      {children ?? '-'}
    </Text>
  );
}

export function DefinitionListDescription({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={classNames('font-medium leading-tight', className)}
      {...props}
    >
      {children ?? '-'}
    </Text>
  );
}
