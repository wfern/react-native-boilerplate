import { View } from 'react-native';

import { classNames } from '@/utils/class-names';

export function Footer({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      className={classNames(
        'border-t border-border bg-card px-5 py-4',
        className,
      )}
      {...props}
    />
  );
}
