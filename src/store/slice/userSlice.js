import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: {},
    user_id: "",
    isLoadingUser: false,
    error: null,
    user_role: "",
    snackBar: {
        message: "",
        show: false,
    },

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
        },
        setUserRole: (state, action) => {
            state.user_role = action.payload
        },
        showSnackbar: (state, action) => {
            state.snackBar = {
                text: action.payload,
                show: true,
            };
          },
          hideSnackbar: (state) => {
            state.snackBar = {
                text: '',
                show: false,
            };
          },
    },
})

export const { setUserDetails, setUserId, setUserRole, showSnackbar, hideSnackbar } = userSlice.actions;

export default userSlice.reducer