'use no memo';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { Masks } from 'react-native-mask-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as yup from 'yup';

import { axios } from '@/lib/axios';
import { updateUser, User } from '@/redux/reducers/authentication';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Button } from '@/components/button';
import { Footer } from '@/components/footer';
import {
  Form,
  FormInput,
  FormItem,
  FormLabel,
  FormMaskedInput,
  FormMessage,
} from '@/components/form';
import { Header, HeaderBackButton, HeaderTitle } from '@/components/header';
import { SafeAreaView } from '@/components/safe-area-view';

type ScreenProps = StaticScreenProps<{
  completeRegistration?: true;
}>;

type QueryResponse = {
  message: string;
  user: User;
};

type QueryError = AxiosError<{
  message: string;
  errors?: Record<string, string[]>;
}>;

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  document_number: yup.string().matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    name: 'document',
    message: 'CPF inválido.',
    excludeEmptyString: true,
  }),
  phone: yup.string().matches(/^\([1-9]{2}\)\s9[2-9]\d{3}-\d{4}$/, {
    name: 'phone',
    message: 'Digite um telefone válido, no formato "(99) 99999-9999".',
    excludeEmptyString: true,
  }),
  address: yup.string(),
  instagram: yup.string(),
});

export function AccountEdit({ route }: ScreenProps) {
  const completeRegistration = !!route.params?.completeRegistration;

  const navigation = useNavigation();

  const user = useAppSelector((state) => state.authentication.user);
  const dispatch = useAppDispatch();

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      document_number: user?.document_number ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
    },
  });

  const {
    formState: { isValid },
    setError,
  } = form;

  const mutation = useMutation<QueryResponse, QueryError>({
    mutationFn: async (requestData) => {
      const { data } = await axios.post(
        '/{user-type-placeholder}/user',
        requestData,
      );

      return data;
    },
    networkMode: 'always',
    retry: false,
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data, {
      onSuccess: (data) => {
        dispatch(
          updateUser({
            name: data.user.name,
            email: data.user.email,
            document_number: data.user.document_number,
            phone: data.user.phone,
            address: data.user.address,
          }),
        );

        navigation.goBack();
      },
      onError(error) {
        if (error.response?.status === 422) {
          Object.entries<string[]>(error.response.data.errors ?? {}).forEach(
            ([key, errors]) => {
              setError(key as any, {
                message: errors[0],
              });
            },
          );
          //
        } else if (
          [400].includes(error.response?.status ?? 0) &&
          error.response?.data.message
        ) {
          setError('name', {
            message: error.response.data.message,
          });
          //
        } else {
          setError('name', {
            message: 'Ocorreu um erro. Verifique a conexão com a internet.',
          });
        }
      },
    });
  };

  return (
    <SafeAreaView>
      <Header>
        {!completeRegistration && <HeaderBackButton />}
        <View className="flex-1">
          <HeaderTitle>
            {completeRegistration ? 'Concluir cadastro' : 'Editar conta'}
          </HeaderTitle>
        </View>
      </Header>

      <Form {...form}>
        <ScrollView contentContainerClassName="p-5 gap-4">
          <FormItem name="name">
            <FormLabel>Nome completo</FormLabel>
            <FormInput placeholder="Digite seu nome completo" />
            <FormMessage />
          </FormItem>

          <FormItem name="email">
            <FormLabel>E-mail</FormLabel>
            <FormInput
              editable={false}
              placeholder="exemplo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormMessage />
          </FormItem>

          <FormItem name="document_number">
            <FormLabel>CPF</FormLabel>
            <FormMaskedInput
              mask={Masks.BRL_CPF}
              keyboardType="numeric"
              placeholder="000.000.000-00"
            />
            <FormMessage />
          </FormItem>

          <FormItem name="phone">
            <FormLabel>Telefone</FormLabel>
            <FormMaskedInput
              mask={Masks.BRL_PHONE}
              keyboardType="numeric"
              placeholder="(99) 99999-9999"
            />
            <FormMessage />
          </FormItem>

          <FormItem name="address">
            <FormLabel>Endereço</FormLabel>
            <FormInput placeholder="Digite seu endereço" />
            <FormMessage />
          </FormItem>

          <FormItem name="instagram">
            <FormLabel>Instagram</FormLabel>
            <FormInput placeholder="@seuinstagram" autoCapitalize="none" />
            <FormMessage />
          </FormItem>
        </ScrollView>
      </Form>

      <Footer>
        <Button
          variant="filled"
          disabled={!isValid}
          onPress={form.handleSubmit(onSubmit)}
        >
          {completeRegistration ? 'Salvar e continuar' : 'Salvar alterações'}
        </Button>
      </Footer>
    </SafeAreaView>
  );
}
