import axiosInstance from "@/config/axiosConfig";

export const loginUser = async (formData) => {
  try {
    const res = await axiosInstance.post("/auth/login", formData);
    return { status: "success", data: res.data };
  } catch (error) {
    console.log(error);
    if (error?.response?.data?.message) {
      return { status: "error", data: error?.response?.data?.message };
    } else {
      return { status: "error", data: "Server Error, Try Again" };
    }
  }
};

export const signUpUser = async (formData) => {
  try {
    const res = await axiosInstance.post("/auth/signup", formData);
    return { status: "success", data: res.data };
  } catch (error) {
    console.log(error);
    if (error?.response?.data?.message) {
      return { status: "error", data: error?.response?.data?.message };
    } else {
      return { status: "error", data: "Server Error, Try Again" };
    }
  }
};

export const updateUserAvatar = async (avatar) => {
  try {
    const res = await axiosInstance.patch("/user/avatar", avatar);
    return { status: "success", data: res.data };
  } catch (error) {
    console.log(error);
    if (error?.response?.data?.message) {
      return { status: "error", data: error?.response?.data?.message };
    } else {
      return { status: "error", data: "Server Error, Try Again" };
    }
  }
};

export const updateUserDetails = async (formData) => {
  try {
    const res = await axiosInstance.patch("/user/details", formData);
    return { status: "success", data: res.data };
  } catch (error) {
    console.log(error);
    if (error?.response?.data?.message) {
      return { status: "error", data: error?.response?.data?.message };
    } else {
      return { status: "error", data: "Server Error, Try Again" };
    }
  }
};

export const updateUserPassword = async (formData) => {
  try {
    const res = await axiosInstance.patch("/user/password", formData);
    return { status: "success", data: res.data };
  } catch (error) {
    console.log(error);
    if (error?.response?.data?.message) {
      return { status: "error", data: error?.response?.data?.message };
    } else {
      return { status: "error", data: "Server Error, Try Again" };
    }
  }
};
