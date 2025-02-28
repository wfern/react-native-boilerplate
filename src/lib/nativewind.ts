import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

function remapThirdPartyProps() {
  cssInterop(Image, {
    className: {
      target: 'style', // map className->style
    },
  });
}

export const NativeWind = {
  remapThirdPartyProps,
};
