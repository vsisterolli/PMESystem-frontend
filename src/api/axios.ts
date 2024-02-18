import axios from "axios";
import {toast} from "react-toastify";

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE
})

export const catchErrorMessage = (error) => {
  console.log(error)
  if(error.response.data.message)
    error.response.data.message.forEach(message => toast.error(message))
  else
    error.response.data.forEach(message => toast.error(message))
}
