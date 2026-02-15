import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tokenResultData:null,
    allTokenListData:null,
    wallet_Blanace:null,
   
}

const CreateTokenSlice = createSlice({
    name: 'CreateTokenData',
    initialState,
    reducers:{
        
        CreateTokenResult:(state,action) => {
            state.tokenResultData = action.payload;
        },
        TokenListData:(state,action) => {
            state.allTokenListData = action.payload;
        },
        CreateTokenDataClear:(state,action) => {
            state.allTokenListData = null;
            state.tokenResultData = null;
            state.wallet_Blanace = null;
           
        },
        MainWalletBalance: (state,action) =>{
         state.wallet_Blanace = action.payload;
        },
       
    },
});

export  const {CreateTokenResult,TokenListData,CreateTokenDataClear,MainWalletBalance} = CreateTokenSlice.actions;

export default CreateTokenSlice.reducer;