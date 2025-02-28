import React, { Ref } from 'react';

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): React.RefCallback<T> {
  return (element: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<T | null>).current = element;
      }
    });
  };
}

export default mergeRefs;
