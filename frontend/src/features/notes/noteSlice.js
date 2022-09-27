import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import noteService from './noteService'

const initialState =  {
    notes: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

// Get ticket notes
export const getNotes = createAsyncThunk('notes/getAll', 
async (ticketId, thunkAPI) => {
    try {
    const token = thunkAPI.getState().auth.user.token
    return await noteService.getNotes(ticketId, token)
} catch (error) {
    const message = 
    (error.response && 
        error.response.data && 
        error.response.data.message) || 
        error.message || 
        error.toString()

    // This gets sent as action.payload to extraReducer state.message
    return thunkAPI.rejectWithValue(message)
}
    }
)


export const noteSlice = createSlice({
    name: 'note',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotes.pending, (state) => {
                state.isLoading = true
            })
            // Passing in action here due to getting data
            .addCase(getNotes.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                // make sure plural tickets because we have single for another object
                state.notes = action.payload
            })
            .addCase(getNotes.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

    }
})

export const { reset } = noteSlice.actions
export default noteSlice.reducer