
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const fetchListings = async ({ token, cursor = 0, listingType = "" }) => {
  const { data } = await axiosInstance.get(
    `api/v1/listings/cursor?limit=3&cursor=${cursor}&listing_type=${listingType}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const useProperties = (listingType) => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ["listingsRealEstate", listingType],
    queryFn: ({ pageParam = 0 }) =>
      fetchListings({ token: user.token, cursor: pageParam, listingType }),
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
    enabled: !!user?.token,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) =>
      lastPage?.data?.pagination?.next_cursor ?? undefined,
  });
};


// // useProperties.js

// import { useInfiniteQuery } from "@tanstack/react-query";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";

// const fetchListings = async ({ token, cursor = 0 }) => {
//   const { data } = await axiosInstance.get(
//     `api/v1/listings/cursor?limit=3&cursor=${cursor}`,
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
//   return data;
// };
// export const useProperties = () => {
//   const { user } = useAuth();

//   return useInfiniteQuery({
//     queryKey: ["listingsRealEstate"],
//     queryFn: ({ pageParam = 0 }) =>
//       fetchListings({ token: user.token, cursor: pageParam }),
//     staleTime: 0,
//     cacheTime: 1000 * 60 * 5,
//     enabled: !!user?.token,
//     refetchOnWindowFocus: false,

//     getNextPageParam: (lastPage) => {
//       return lastPage?.data?.pagination?.next_cursor ?? undefined;
//     },
//   });
// }; 