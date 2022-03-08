/* eslint-disable no-undef */
import React, {
  createContext, useRef, useState, useMemo,
} from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { Toast } from './Toast';

export const ToastContext = createContext<Toast>({
  addToast: () => {},
  setToastPosition: () => {},
});

export default function ToastProvider({ children }: {children: JSX.Element}) {
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const toastPosition = useRef<SnackbarOrigin>({ horizontal: 'center', vertical: 'bottom' });
  const addToast = (msg: string) => {
    setShowToast(true);
    setMessage(msg);
  };
  const setToastPosition = (position: SnackbarOrigin) => {
    toastPosition.current = position;
  };

  const contextData = useMemo(() => ({ addToast, setToastPosition }), []);

  return (
    <ToastContext.Provider value={contextData}>
      <Snackbar
        anchorOrigin={{ ...toastPosition.current }}
        open={showToast}
        onClose={() => setShowToast(false)}
        message={message}
        autoHideDuration={2000}
      />
      {children}
    </ToastContext.Provider>
  );
}
