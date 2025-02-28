import * as React from 'react';
import { BackHandler } from 'react-native';

export function useDisableGoingBack(condition: boolean = true) {
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return condition;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [condition]);
}
