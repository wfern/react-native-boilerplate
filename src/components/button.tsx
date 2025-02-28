import * as React from 'react';
import { useLinkProps, type LinkProps } from '@react-navigation/native';
import { tv, VariantProps } from 'tailwind-variants';

import { Pressable } from '@/components/pressable';
import { Text } from '@/components/text';

const buttonVariants = tv({
  slots: {
    base: 'rounded-xl px-6 py-2',
    text: 'text-center',
  },
  // TODO: and add a new color variant
  variants: {
    variant: {
      tinted: {
        base: 'bg-primary-100',
        text: 'text-primary-500',
      },
      filled: {
        base: 'bg-primary-500',
        text: 'text-primary-foreground',
      },
      plain: {
        base: 'bg-transparent',
        text: 'text-primary-500',
      },
      outline: {
        base: 'border border-primary-500',
        text: 'text-primary-500',
      },
    },
    size: {
      sm: {
        base: 'px-3 py-3',
        text: 'text-sm',
      },
      md: {
        base: 'px-4 py-3.5',
        text: 'text-base',
      },
      lg: {
        base: 'px-4 py-4',
        text: 'text-lg',
      },
    },
    disabled: {
      true: {
        base: 'opacity-50',
      },
    },
  },
  defaultVariants: {
    variant: 'tinted',
    size: 'md',
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

type PressableProps = Omit<React.ComponentProps<typeof Pressable>, 'children'>;

type ButtonProps = ButtonVariants &
  PressableProps & {
    children: string | string[];
  };

type LinkButtonProps<ParamList extends ReactNavigation.RootParamList> =
  LinkProps<ParamList> & Omit<ButtonProps, 'onPress'>;

// export function Button<ParamList extends ReactNavigation.RootParamList>(
//   props: LinkButtonProps<ParamList>,
// ): React.JSX.Element;
// export function Button(props: ButtonProps): React.JSX.Element;

export function Button<ParamList extends ReactNavigation.RootParamList>(
  props: ButtonProps | LinkButtonProps<ParamList>,
) {
  if ('screen' in props || 'action' in props) {
    return <LinkButton {...props} />;
  } else {
    return <BaseButton {...props} />;
  }
}

function LinkButton<ParamList extends ReactNavigation.RootParamList>({
  screen,
  params,
  action,
  href,
  ...props
}: LinkButtonProps<ParamList>) {
  // @ts-expect-error: This is already type-checked by the prop types
  const linkProps = useLinkProps({ screen, params, action, href });

  return <BaseButton {...props} {...linkProps} />;
}

function BaseButton({
  size,
  variant,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const { base, text } = buttonVariants({ size, variant, disabled });

  return (
    <Pressable className={base({ className })} disabled={disabled} {...props}>
      <Text className={text()}>{children}</Text>
    </Pressable>
  );
}
