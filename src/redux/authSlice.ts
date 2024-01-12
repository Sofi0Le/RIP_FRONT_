import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';

interface AuthState {
  authToken: string | null;
  username: string | null;
  userrole: string | null;
}

const initialState: AuthState = {
  authToken: Cookies.get('session_key') || null,
  username: null,
  userrole: null,
};

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    // Send a request to the server to log out
    await axios.get('http://localhost:8000/api/users/logout/', {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Error during logout:', error);
    // You might want to handle the error here
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
      Cookies.set('session_key', action.payload);
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setUserrole: (state, action: PayloadAction<string>) => {
      state.userrole = action.payload;
    },
    clearAuthToken: (state) => {
      state.authToken = null;
      Cookies.remove('session_key');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.authToken = null;
      Cookies.remove('session_key');
    });
  },
});

export const { setAuthToken, setUsername, setUserrole, clearAuthToken } = authSlice.actions;

export default authSlice.reducer;
