import { configureStore } from '@reduxjs/toolkit';
import AuthSlices from '../AuthSlices/AuthSlices';
import CreateTokenSlice from '../createTokenSlice/CreateTokenSlice';
import PresaleSlice from '../PresaleSlice/PresaleSlice';
const store = configureStore({
    reducer:{
      auth: AuthSlices,
      CreateToken:CreateTokenSlice,
      presale:PresaleSlice
    },
});


export default store;