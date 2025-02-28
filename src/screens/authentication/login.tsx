'use no memo';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Image, ScrollView, TextInput, View } from 'react-native';
import { login } from '@/providers/authentication';
import { yupResolver } from '@hookform/resolvers/yup';
import { StaticScreenProps } from '@react-navigation/native';

import logo from '@/assets/images/logo.png';
import { axios } from '@/lib/axios';
import * as yup from '@/lib/yup';
import { User } from '@/redux/reducers/authentication';
import { Button } from '@/components/button';
import {
  Form,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/form';
import { SafeAreaView } from '@/components/safe-area-view';
import { DeveloperButton } from '@/screens/developer';
import { delay } from '@/utils/delay';

type Props = StaticScreenProps<{}>;

const defaultValues = {
  email: '',
  password: '',
};

type DefaultValueKey = keyof typeof defaultValues;

const validationRules = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

export function Login({ route }: Props) {
  const form = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(validationRules),
  });

  const {
    formState: { isSubmitting },
    setError,
    setValue,
  } = form;

  const passwordInputRef = React.useRef<TextInput | null>(null);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (__DEV__) {
      await delay(1000);
    }

    try {
      const response = await axios.post<{ user: User; access_token: string }>(
        `/login`,
        {
          email: data.email,
          password: data.password,
          // device_identifier: deviceName,
        },
      );

      login({
        user: response.data.user,
        accessToken: response.data.access_token,
      });
      //
    } catch (error: any) {
      if (error.response?.status === 422) {
        Object.entries<string[]>(error.response.data.errors).forEach(
          ([key, errors]) => {
            let field = (
              defaultValues[key as DefaultValueKey] ? key : 'email'
            ) as DefaultValueKey;

            setError(field, {
              message: errors[0],
            });
          },
        );
        //
      } else if (
        ['400'].includes(error.response?.status) &&
        error.response?.data.message
      ) {
        setError('email', {
          message: error.response.data.message,
        });
        //
      } else {
        setError('email', {
          message:
            'Ocorreu um erro ao realizar o login. Verifique a conexão com a internet.',
        });
      }
    }
  });

  React.useEffect(() => {
    if (__DEV__) {
      setValue('email', 'user@example.com');
      setValue('password', 'test');
    }
  }, [setValue]);

  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="p-8"
      >
        <View className="mt-20 gap-10">
          <DeveloperButton>
            <Image source={logo} className="aspect-[3/1] h-16" />
          </DeveloperButton>
          <Form {...form}>
            <View className="gap-4">
              <FormItem name="email">
                <FormLabel>Usuário</FormLabel>
                <FormInput
                  placeholder="exemplo@exemplo.com"
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
                <FormMessage />
              </FormItem>
              <FormItem name="password">
                <FormLabel>Senha</FormLabel>
                <FormInput
                  ref={passwordInputRef}
                  placeholder="Senha"
                  secureTextEntry
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit}
                />
                <FormMessage />
              </FormItem>
              {/* <View className="mt-6 h-96 rounded-lg border border-border bg-card p-4"></View> */}
            </View>
          </Form>
          <Button
            variant="filled"
            disabled={isSubmitting}
            onPress={handleSubmit}
          >
            {isSubmitting ? 'Loading...' : 'Login'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
