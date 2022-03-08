import { useContext } from 'react';
import { ToastContext } from '../shared/providers/toast-provider/ToastProvider';

export default function useToast() {
  const contextData = useContext(ToastContext);
  return contextData;
}
