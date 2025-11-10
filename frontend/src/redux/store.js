import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import messageSlice from "./messageSlice"

const store=configureStore({
   reducer:{
     user:userSlice,
     message:messageSlice
   },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // <— disable check
    })
})

export default store