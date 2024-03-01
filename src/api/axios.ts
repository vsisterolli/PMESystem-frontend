import axios from "axios";
import { toast } from "react-toastify";

export const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE
});

export const catchErrorMessage = (error) => {
    try {
        if (!Array.isArray(error?.response?.data.message))
            toast.error(error?.response?.data.message);
        if (error?.response?.data?.message && Array.isArray(error.response.data.message))
            error.response.data.message.forEach((message) => toast.error(message));
        if (error?.response?.data && Array.isArray(error.response.data))
            error.response.data.forEach((message) => toast.error(message));
    } catch {}
};
