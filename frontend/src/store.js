import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';
import productReducer from './features/products/productSlice';
import categoryReducer from './features/categories/categorySlice';
import orderReducer from './features/orders/orderSlice';
import adminReducer from './features/admin/adminSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
    admin: adminReducer,
  },
});
