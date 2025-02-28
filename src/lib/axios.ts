import axios, { AxiosError } from 'axios';

import { store } from '@/redux/store';

export const BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api'
  : 'https://boilerplate.com';

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  async (config) => {
    const { authentication } = store.getState();

    if (
      config.baseURL === instance.defaults.baseURL &&
      !config.headers?.Authorization &&
      !config.url?.includes('login')
    ) {
      if (authentication.accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${authentication.accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

function getAxiosErrorMessage(error: AxiosError<any>): string {
  if (error.code === AxiosError.ECONNABORTED) {
    return 'Timeout! Não foi possivel estabelecer uma conexão com o servidor.';
    //
  } else if (error.code === AxiosError.ERR_NETWORK) {
    return 'Não foi possivel estabelecer uma conexão com o servidor, verifique sua conexão e tente novamente.';
  }

  if (error.response) {
    if (
      error.response.status === 400 &&
      error.response.data &&
      error.response.data.message
    ) {
      return error.response.data.message;
      //
    } else if (error.response.status === 401 || error.response.status === 403) {
      return 'Você não esta autorizado, tente sair e fazer o login novamente.';
      //
    } else if (error.response.status === 404) {
      return 'Nada encontrado.';
      //
    } else if (error.response.status === 422 && error.response.data?.errors) {
      return Object.values<Record<string, any>>(
        error.response.data?.errors ?? {},
      ).reduce((acc, fieldErrors, index, array) => {
        let fieldError = '';

        fieldErrors.forEach((subError: string, subIndex: number) => {
          fieldError += `${index + 1}.${subIndex + 1}. ${subError}`;

          if (subIndex < fieldErrors.length - 1) {
            fieldError += `\r\n`;
          }
        });

        if (index < array.length - 1) {
          fieldError += `\r\n\r\n`;
        }

        return (acc += fieldError);
      }, '');
      //
    } else if (error.response.status === 500) {
      return 'Erro interno, já estamos cuidando disso, tente novamente mais tarde.';
    }
  }

  return (
    error.message ||
    'Ocorreu um erro ao tentar se conectar com nossos serviços, verifique sua conexão e tente novamente.'
  );
}

export { instance as axios, getAxiosErrorMessage };
