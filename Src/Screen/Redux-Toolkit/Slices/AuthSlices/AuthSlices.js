import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  userData: null,
  authToken: null,
  dataUpdate: null,
  createPreSale: null,
  tokenImage: null,
  UserDetails:null,
  BioMetric:'0',
  routeName:'Home',
  PushNotificationStatus:false,
  autoUpdate:false,
  passcodeActive:'0',
  aboutusData:null,
  isKycVerified:0,
  pancardDetails:null,
  AdharcardDetails:null,
  isEditProfile:false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
    },
    logoutSuccess: (state, action) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.authToken = null;
      state.dataUpdate = null;
      state.createPreSale = null;
      state.tokenImage = null;
      state.UserDetails = null
      state.BioMetric = null;
      state.autoUpdate = null;
      state.passcodeActive = null;
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    dataUpdate: (state, action) => {
      state.dataUpdate = action.payload;
    },
    CreatePreSaleSuccess: (state, action) => {
      state.createPreSale = action.payload;
    },
    userImage: (state, action) => {
      state.tokenImage = action.payload;
    },
    userDetailsEditable: (state, action) => {
      state.UserDetails = action.payload;
    },
    BioMetricUpdate: (state, action) => {
      state.BioMetric = action.payload;
    },
    PasscodeActiveUpdate: (state, action) => {
      state.passcodeActive = action.payload;
    },
    SetRouteName:(state,action) => {
      state.routeName = action.payload;
    },
    setPushNotificationStatus:(state,action) => {
      state.PushNotificationStatus = action.payload;
    },
    autoUpdateApp:(state,action) =>{
      state.autoUpdate = action.payload;
    },
    setAboutUsData:(state,action) =>{
      state.aboutusData = action.payload;
    },
    setisKycVerified:(state,action) =>{
      state.isKycVerified = action.payload;
    }, 
    setAdharcardData:(state,action) =>{
      state.AdharcardDetails = action.payload;
    }, 
    setpandcardData:(state,action) =>{
      state.pancardDetails = action.payload;
    }, 
    setisEditProfile:(state,action) =>{
      state.isEditProfile = action.payload;
    }, 
  },
});

export const {
  setisEditProfile,
  setAdharcardData,
  setpandcardData,
  SetRouteName,
  loginSuccess,
  logoutSuccess,
  setAuthToken,
  dataUpdate,
  CreatePreSaleSuccess,
  userImage,
  userDetailsEditable,
  BioMetricUpdate,
  setPushNotificationStatus,
  autoUpdateApp,
  PasscodeActiveUpdate,
  setAboutUsData,
  setisKycVerified
} = authSlice.actions;

export default authSlice.reducer;
