import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isLoggedIn: false,
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
})

export default authSlice.reducer

