import axios from 'axios';
import { toast } from 'react-toastify';
import setSearchValue from '../redux/calcSlice';

export const setSearchValueAction = (searchValue) => (dispatch) => {
    dispatch(setSearchValue(searchValue));
  };
