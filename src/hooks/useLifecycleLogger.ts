import * as React from 'react';
import { InteractionManager } from 'react-native';

// Lifecycle order react-native old arch (paper) to see
// the best time to capture the view after render.
//
// - useLayoutEffect
// - useEffect
// - useEffect runAfterInteractions
// - useEffect setTimeout 0
// - onLayout
// - onLayout runAfterInteractions
// - image onLoad
// - image onLoad runAfterInteractions
// - onLayout setTimeout 0
// - image onLoad setTimeout 0

export function useLifecycleLogger() {
  React.useLayoutEffect(() => {
    console.log('useLayoutEffect');
  }, []);

  React.useEffect(() => {
    console.log('useEffect');

    InteractionManager.runAfterInteractions(() => {
      console.log('useEffect runAfterInteractions');
    });

    setTimeout(() => {
      console.log('useEffect setTimeout');
    }, 0);
  }, []);

  const onLayout = () => {
    console.log('onLayout');

    InteractionManager.runAfterInteractions(() => {
      console.log('onLayout runAfterInteractions');
    });

    setTimeout(() => {
      console.log('onLayout setTimeout');
    }, 0);
  };

  const onImageLoad = () => {
    console.log('onImageLoad');

    InteractionManager.runAfterInteractions(() => {
      console.log('onImageLoad runAfterInteractions');
    });

    setTimeout(() => {
      console.log('onImageLoad setTimeout');
    }, 0);
  };

  return { onLayout, onImageLoad };
}
