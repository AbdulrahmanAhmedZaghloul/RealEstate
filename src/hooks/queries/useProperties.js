// useProperties.js
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const fetchListings = async ({
  token,
  listingType = "",
  location = "",
  rooms = "",
  bathrooms = "",
  areaMin = "",
  areaMax = "",
  priceMin = "",
  priceMax = "",
  category = "",
   sort_by = "",    // 👈 جديد
  sort_dir = "",    // 👈 جديد
  search = "", // 👈 هنا تم إضافة متغير جديد
  subcategory = "",
  cursor = 0,

}) => {

  const params = new URLSearchParams({
    limit: 3,
    cursor,
    listing_type: listingType,
    ...(location && { location }),
    ...(rooms && { rooms }),
    ...(bathrooms && { bathrooms }),
    ...(areaMin && { area_min: areaMin }),
    ...(areaMax && { area_max: areaMax }),
    ...(priceMin && { price_min: priceMin }),
    ...(priceMax && { price_max: priceMax }),
    ...(category && { category_id: category }),
    ...(subcategory && { subcategory_id: subcategory }),
    ...(search && { search }), // 👈 استخدام المُعامل الجديد هنا
 ...(sort_by && { sort_by }),     // 👈 تم الإضافة
    ...(sort_dir && { sort_dir }),
  });

  const { data } = await axiosInstance.get(`listings/cursor?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Fetched Listings Data:", data);

  return data;
};

export const useProperties = (listingType, filters = {}) => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ["listingsRealEstate", listingType, filters],
    queryFn: ({ pageParam = 0 }) =>
      fetchListings({
        token: user.token,
        cursor: pageParam,
        listingType,
        ...filters,
      }),
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
    enabled: !!user?.token,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) =>
      lastPage?.data?.pagination?.next_cursor ?? undefined,
  });
};

// export const useProperties = (listingType, filters = {}) => {
//   const { user } = useAuth();

//   return useInfiniteQuery({
//     queryKey: ["listingsRealEstate", listingType, filters],
//     queryFn: ({ pageParam = 0 }) =>
//       fetchListings({
//         token: user.token,
//         cursor: pageParam,
//         listingType,
//         ...filters,
//       }),
//     staleTime: 0,
//     cacheTime: 1000 * 60 * 5,
//     enabled: !!user?.token,
//     refetchOnWindowFocus: false,
//     getNextPageParam: (lastPage) =>
//       lastPage?.data?.pagination?.next_cursor ?? undefined,
//   });
// };
