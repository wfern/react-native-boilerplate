import { View } from 'react-native';

import { classNames } from '@/utils/class-names';

export function Divider({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      className={classNames('my-4 h-px w-full bg-border', className)}
      {...props}
    />
  );
}
