import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useUniqueId = () => {
  const idRef = useRef<string | null>(null);
  if (!idRef.current) {
    idRef.current = uuidv4();
  }
  return idRef.current;
};

export default useUniqueId;
