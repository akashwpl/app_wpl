import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: {
        id: '1',
        name: 'Giga Wolf',
        email: 'wolf@giga.com',
        role: 'Giga Admin',
        createdAt: '3 days ago',
        updatedAt: '',
        kyc: {
            isVerified: false,
            verifiedAt: '2 days ago'
        }
    },
    isLoadingUser: false,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchUser.fulfilled, (state, action) => {
    //             state.user = action.payload
    //         })
    // }
})

export default userSlice.reducer