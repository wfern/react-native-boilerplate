import { Text } from '@/components/text';
import { classNames } from '@/utils/class-names';

export function ListTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={classNames('text-xl font-semibold', className)}
      {...props}
    />
  );
}

export function ListDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={classNames('text-xs text-muted-foreground', className)}
      {...props}
    />
  );
}
