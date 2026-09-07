import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";


import * as orderApi from "./orderApi";



// =======================================
// Create Order
// =======================================

export const createOrder = createAsyncThunk(

  "orders/createOrder",

  async(orderData, thunkAPI)=>{

    try{

      return await orderApi.createOrder(
        orderData
      );


    }catch(err){

      return thunkAPI.rejectWithValue(

        err.response?.data?.message ||
        "Failed to create order"

      );

    }

  }

);





// =======================================
// Get My Orders
// =======================================

export const fetchMyOrders = createAsyncThunk(

  "orders/fetchMyOrders",

  async(_, thunkAPI)=>{

    try{

      return await orderApi.getMyOrders();


    }catch(err){

      return thunkAPI.rejectWithValue(

        err.response?.data?.message ||
        "Failed to fetch orders"

      );

    }

  }

);





// =======================================
// Get Single Order
// =======================================

export const fetchOrderById = createAsyncThunk(

  "orders/fetchOrderById",

  async(id, thunkAPI)=>{


    try{


      return await orderApi.getOrderById(
        id
      );


    }catch(err){


      return thunkAPI.rejectWithValue(

        err.response?.data?.message ||
        "Failed to fetch order"

      );


    }


  }

);






// =======================================
// Cancel Order
// =======================================

export const cancelOrder = createAsyncThunk(

  "orders/cancelOrder",

  async(id, thunkAPI)=>{


    try{


      await orderApi.cancelOrder(id);


      thunkAPI.dispatch(
        fetchMyOrders()
      );


      return id;


    }catch(err){


      return thunkAPI.rejectWithValue(

        err.response?.data?.message ||
        "Failed to cancel order"

      );


    }


  }

);





const initialState = {


  orders: [],

  currentOrder: null,

  loading:false,

  error:null,


};





const orderSlice = createSlice({


  name:"orders",


  initialState,



  reducers:{


    clearCurrentOrder:(state)=>{

      state.currentOrder = null;

    },


  },





  extraReducers:(builder)=>{


    builder



    // ==========================
    // Create Order
    // ==========================


    .addCase(
      createOrder.pending,
      (state)=>{

        state.loading=true;
        state.error=null;

      }
    )



    .addCase(
      createOrder.fulfilled,
      (state,action)=>{


        state.loading=false;


        state.currentOrder =
          action.payload.order;


      }
    )



    .addCase(
      createOrder.rejected,
      (state,action)=>{


        state.loading=false;


        state.error =
          action.payload;


      }
    )







    // ==========================
    // Fetch My Orders
    // ==========================


    .addCase(
      fetchMyOrders.pending,
      (state)=>{


        state.loading=true;
        state.error=null;


      }
    )



    .addCase(
      fetchMyOrders.fulfilled,
      (state,action)=>{


        state.loading=false;


        state.orders =
          action.payload.orders;


      }
    )



    .addCase(
      fetchMyOrders.rejected,
      (state,action)=>{


        state.loading=false;


        state.error =
          action.payload;


      }
    )







    // ==========================
    // Fetch Single Order
    // ==========================


    .addCase(
      fetchOrderById.pending,
      (state)=>{


        state.loading=true;

        state.error=null;


      }
    )



    .addCase(
      fetchOrderById.fulfilled,
      (state,action)=>{


        state.loading=false;


        state.currentOrder =
          action.payload.order;


      }
    )



    .addCase(
      fetchOrderById.rejected,
      (state,action)=>{


        state.loading=false;


        state.error =
          action.payload;


      }
    )







    // ==========================
    // Cancel Order
    // ==========================


    .addCase(
      cancelOrder.pending,
      (state)=>{


        state.loading=true;


      }
    )



    .addCase(
      cancelOrder.fulfilled,
      (state)=>{


        state.loading=false;


      }
    )



    .addCase(
      cancelOrder.rejected,
      (state,action)=>{


        state.loading=false;


        state.error =
          action.payload;


      }
    );


  },


});





export const {
  clearCurrentOrder,

} = orderSlice.actions;



export default orderSlice.reducer;