import * as React from 'react';
import {
  ControllerFieldState,
  FieldValues,
  FormProvider,
  useController,
  UseControllerReturn,
  useFormContext,
} from 'react-hook-form';
import { TextInput, View } from 'react-native';

import { Input } from '@/components/input';
import { InputMessage } from '@/components/input-message';
import { Label } from '@/components/label';
import { MaskedInput } from '@/components/masked-input';
import { Text } from '@/components/text';
import { classNames } from '@/utils/class-names';
import mergeRefs from '@/utils/merge-refs';

export const Form = FormProvider;

type FormItemContextValue = {
  id: string;
  name: string;
  field: UseControllerReturn<FieldValues, string>['field'];
  fieldState: ControllerFieldState;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const useFormField = () => {
  const formItemContext = React.useContext(FormItemContext);

  if (!formItemContext) {
    throw new Error('useFormField should be used within <FormItem>');
  }

  const { id, name, field, fieldState } = formItemContext;

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    field,
    fieldState,
  };
};

export const FormItem = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & { name: string }
>(({ className, name, ...props }, ref) => {
  const id = React.useId();

  const { field } = useController({ name });

  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(name, formState);

  return (
    <FormItemContext.Provider value={{ id, name, field, fieldState }}>
      <View ref={ref} className={classNames('gap-1', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

export const FormLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof Label>) => {
  const { fieldState } = useFormField();

  const error = fieldState.error;

  return (
    <Label
      className={classNames(error && 'text-red-600', className)}
      {...props}
    />
  );
};

export const FormInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, forwardRef) => {
  const {
    // formDescriptionId,
    // formMessageId,
    field: { onChange, ref: fieldRef, ...field },
    fieldState,
  } = useFormField();

  const error = fieldState.error;

  const handleRef = (instance: TextInput | null) => {
    mergeRefs(forwardRef, fieldRef)(instance);
  };

  return (
    <Input
      ref={handleRef}
      // aria-describedby={
      //   !error
      //     ? `${formDescriptionId}`
      //     : `${formDescriptionId} ${formMessageId}`
      // }
      // aria-invalid={!!error}
      className={classNames(error && 'border border-destructive', className)}
      onChangeText={onChange}
      {...field}
      {...props}
    />
  );
});
FormInput.displayName = 'FormInput';

export const FormMaskedInput = React.forwardRef<
  React.ElementRef<typeof MaskedInput>,
  React.ComponentPropsWithoutRef<typeof MaskedInput>
>(({ className, ...props }, forwardRef) => {
  const {
    field: { onChange, ref: fieldRef, ...field },
    fieldState,
  } = useFormField();

  const error = fieldState.error;

  const handleRef = (instance: TextInput | null) => {
    mergeRefs(forwardRef, fieldRef)(instance);
  };

  return (
    <MaskedInput
      ref={handleRef}
      className={classNames(error && 'border border-destructive', className)}
      onChangeText={(masked, unmasked) => {
        onChange(masked);
      }}
      {...field}
      {...props}
    />
  );
});
FormMaskedInput.displayName = 'FormMaskedInput';

export const FormDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof Text>) => {
  return (
    <Text
      className={classNames('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
};

export const FormMessage = ({
  children,
  ...props
}: React.ComponentProps<typeof InputMessage>) => {
  const { fieldState } = useFormField();

  const error = fieldState.error;
  const errorBody = error ? String(error?.message) : children;

  if (!errorBody) {
    return null;
  }

  return <InputMessage {...props}>{errorBody}</InputMessage>;
};
