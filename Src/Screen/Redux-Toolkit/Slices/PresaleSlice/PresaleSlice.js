import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    presaleList:null,
    autoUpdate:false
}

const presaleSlice = createSlice({
    name: 'Presale',
    initialState,
    reducers:{
        
        PresaleList:(state,action) => {
            state.presaleList = action.payload;
        },
        PresaleListnull:(state,action) => {
            state.presaleList = null;
            state.autoUpdate = null;
        },
        AutoPresaleDataUpdate: (state,action) =>{
            state.autoUpdate = action.payload;
           }
    },
});

export  const {PresaleList,PresaleListnull,AutoPresaleDataUpdate} = presaleSlice.actions;

export default presaleSlice.reducer;