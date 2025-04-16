import { create } from "zustand";
import axios from "axios";
import { Truck } from "lucide-react";
const host = import.meta.env.VITE_BACKEND_HOST

export const authStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    isSigningIn: false,
    isUpdating: false,
    isUpdatingProfile: false,
    isAdmin:false,

    checkAuth: async () => {
        try {
            const token = localStorage.getItem("token");
            if(!token){
                set({ authUser: null, isCheckingAuth: false });
                return;
            }
            // console.log(token);
            const response = await axios.get(`${host}/api/auth/check`,{
                headers: { "Authorization": `Bearer ${token}` }
            });
            if(!response){
                console.log("No response")
            }
            if(response.data[0].role === "admin"){
                set({isAdmin:true});
            }
            // console.log(response.data[0]);
            set({ authUser: response.data[0], isCheckingAuth: false });
        } catch (error) {
            console.error("Error in checkAuth:", error.message);
            set({ isCheckingAuth: false }); // Ensure state updates even on error
        }
    }
}));
