import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: {},
    user_id: "",
    isLoadingUser: false,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.user = action.payload;
        },
        setUserId: (state, action) => {
            state.user_id = action.payload
        }
    },
})

export const { setUserDetails, setUserId } = userSlice.actions;

export default userSlice.reducer