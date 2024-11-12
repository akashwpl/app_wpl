import { createAsyncThunk } from '@reduxjs/toolkit';
import { hideSnackbar, showSnackbar } from './slice/userSlice';

export const displaySnackbar = createAsyncThunk(
  'app/displaySnackbar',
  async (message, { dispatch }) => {
    console.log('message', message);  

    dispatch(showSnackbar(message));
    setTimeout(() => {
      dispatch(hideSnackbar());
    }, 3000);
  }
);