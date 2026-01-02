import { useEffect, useState } from 'react';

export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Framework is ready after component mounts
    setIsReady(true);
  }, []);

  return isReady;
}
