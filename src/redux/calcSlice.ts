import { createSlice } from '@reduxjs/toolkit';

const calculationsSlice = createSlice({
  name: 'calculations',
  initialState: {
    searchValue: '',
    calculations: [],
  },
  reducers: {
    setSearchValue: (state, action) => {
      return { ...state, searchValue: action.payload };
    },
    setCalculations: (state, action) => {
        return { ...state, calculations: action.payload };
      },
  },
});

export const {
  setSearchValue,
  setCalculations,
} = calculationsSlice.actions;

export default calculationsSlice.reducer;