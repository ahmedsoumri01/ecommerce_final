// Store reset utility to clear all stores on logout
const storeResetFns = new Set<() => void>();

export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};

export const subscribeToReset = (resetFn: () => void) => {
  storeResetFns.add(resetFn);
  return () => storeResetFns.delete(resetFn);
};
