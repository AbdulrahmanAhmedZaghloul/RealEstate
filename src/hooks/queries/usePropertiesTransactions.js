// useProperties.js
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const fetchListings = async ({
  token,
  page = 1, // نستخدم رقم الصفحة بدلاً من cursor
  listingType = "",
  filters = {},
}) => {
  const params = new URLSearchParams({
    page,
    limit: 3,
    ...(listingType && listingType !== "all" ? { listing_type: listingType } : {}),
    ...(filters.location && { location: filters.location }),
    ...(filters.rooms && { rooms: filters.rooms }),
    ...(filters.priceMin && { price_min: filters.priceMin }),
    ...(filters.priceMax && { price_max: filters.priceMax }),
    ...(filters.category && { category_id: filters.category }),
    ...(filters.subcategory && { subcategory_id: filters.subcategory }),
  });

  const { data } = await axiosInstance.get(`listings/pending?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Fetched Listings Data:", data);

  return {
    data: data?.data?.listings?.data,
    pagination: {
      currentPage: data?.data?.listings?.current_page,
      lastPage: data?.data?.listings?.last_page,
    },
  };
};

export const usePropertiesTransactions = (listingType, filters = {}) => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ["listingsRealEstate-pending", listingType, filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchListings({
        token: user.token,
        page: pageParam,
        listingType,
        filters,
      }),
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
    enabled: !!user?.token,
    refetchOnWindowFocus: false,

    // تحديد متى هناك صفحة تالية
    getNextPageParam: (lastPage) => {
        console.log(lastPage);
        
      const nextPage = lastPage?.pagination?.currentPage + 1;
      return lastPage?.pagination?.currentPage < lastPage?.pagination?.lastPage
        ? nextPage
        : undefined;
    },
  });
};
// // useProperties.js
// import { useInfiniteQuery } from "@tanstack/react-query";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";

// const fetchListings = async ({
//   token,
//   cursor = 0,
//   listingType = "",
//   location = "",
//   rooms = "",
//   priceMin = "",
//   priceMax = "",
//   category = "",
//   subcategory = "",
// }) => {
  
//   const params = new URLSearchParams({
//     limit: 3,
//     cursor,
//     listing_type: listingType,
//     ...(location && { location }),
//     ...(rooms && { rooms }),
//     ...(priceMin && { price_min: priceMin }),
//     ...(priceMax && { price_max: priceMax }),
//     ...(category && { category_id: category }),
//     ...(subcategory && { subcategory_id: subcategory }),
//     // ...(employee && { employee_id: employee }),
//   });

//   const { data } = await axiosInstance.get(`listings/pending?${params}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   console.log("Fetched Listings Data:", data);

//   return data;
// };

// export const usePropertiesTransactions = (listingType, filters = {}) => {
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
