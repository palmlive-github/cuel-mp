import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import yearReducer from './yearSlice.js'
import projectReducer from './projectSlice.js'
import deptReducer from './deptSlice.js'
import employeeReducer from './employeeSlice.js'
import gpReducer from './gpSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    year: yearReducer,
    project: projectReducer,
    dept: deptReducer,
    employee: employeeReducer,
    gp: gpReducer,
  },
})
