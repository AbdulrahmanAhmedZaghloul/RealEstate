// hooks/queries/Admin/useAddAdmin.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";

export const useAddAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAdminData) => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const { data } = await axiosInstance.post(
        "admin/admins", // 1. URL
        newAdminData, // 2. البيانات (body)
        {
          // 3. الكونفيج (بما فيه الهيدر)
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      // أو استخدم setQueryData لتحديث بدون إعادة جلب
    },
    onError: (error) => {
      console.error("Error adding admin:", error);
    },
  });
};
// // hooks/queries/useAddAdmin.js
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axiosInstance from "../../../api/config";

// export const useAddAdmin = (token) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (newAdminData) => {
//       console.log(newAdminData);
//       console.log(token);

//       const { data } = await axiosInstance.post("admin/admins", {
//         headers: { Authorization: `Bearer ${token}` },
//       } , newAdminData);
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admins"] }); // تحديث القائمة
//     },
//   });
// };

// // hooks/queries/useAdminProfile.js
// import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "../../../api/config";

// export const useAdminProfile = (token) =>
//   useQuery({
//     queryKey: ["adminProfile"],
//     queryFn: async () => {
//       const { data } = await axiosInstance.get("/admin/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return data.admin;
//     },
//     enabled: !!token,
//   });
