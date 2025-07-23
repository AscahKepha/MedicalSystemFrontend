import { configureStore } from "@reduxjs/toolkit";//for setting up the store
import {persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import authReducer from "../features/auth/authSlice";
import { userApi } from "../features/api/userApi";
import { complaintsApi } from "../features/api/ComplaintsApi";
import { DoctorsApi } from "../features/api/DoctorsApi";
import { patientsApi } from "../features/api/PatientsApi";
import { AppointmentsApi } from "../features/api/AppointmentsApi";
import { PaymentsApi } from "../features/api/PaymentsApi";
import { PrescriptionsApi } from "../features/api/PrescriptionsApi";


//create a persist config for auth Slice
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist:['user', 'token', 'isAuthenticated', 'userType'] //Authorizes a user shows which informations should be persisted there login status are retained even one reloads the page
}

//create a persisted reducer for auth slice
const persistAuthReducer = persistReducer(authPersistConfig,authReducer)

export const store = configureStore({ //is where the sstore is created then combines the Api's
    reducer:{
        [userApi.reducerPath]:userApi.reducer, //each with it's reducer path and generates a reducerxc v   mcs< ADqw    1
        [complaintsApi.reducerPath]:complaintsApi.reducer,
        [DoctorsApi.reducerPath]:DoctorsApi.reducer,
        [AppointmentsApi.reducerPath]:AppointmentsApi.reducer,
        [PaymentsApi.reducerPath]:PaymentsApi.reducer,
        [patientsApi.reducerPath]:patientsApi.reducer,
        [PrescriptionsApi.reducerPath]:PrescriptionsApi.reducer,
        //we use the persist reducer here
        auth:persistAuthReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck:false,
        }).concat(userApi.middleware, complaintsApi.middleware, DoctorsApi.middleware, AppointmentsApi.middleware, PaymentsApi.middleware, patientsApi.middleware, PrescriptionsApi.middleware) //appointmentApi.middleware, paymentsApi.middleware
})

//Export the persisted store
export const persistor = persistStore(store)

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch