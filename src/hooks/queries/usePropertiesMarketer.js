// useProperties.js
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const fetchListings = async ({
    token,
    cursor = 0,
    listingType = "",
    location = "",
    rooms = "",
    priceMin = "",
    priceMax = "",
    category = "",
    subcategory = "",
}) => {

    const params = new URLSearchParams({
        limit: 3,
        cursor,
        listing_type: listingType,
        ...(location && { location }),
        ...(rooms && { rooms }),
        ...(priceMin && { price_min: priceMin }),
        ...(priceMax && { price_max: priceMax }),
        ...(category && { category_id: category }),
        ...(subcategory && { subcategory_id: subcategory }),
        // ...(employee && { employee_id: employee }),
    });

    const { data } = await axiosInstance.get(`marketer/listings/cursor?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetched Listings Data:", data);

    return data;
};

export const usePropertiesMarketer = (listingType, filters = {}) => {
    const { user } = useAuth();

    return useInfiniteQuery({
        queryKey: ["listingsRealEstate-marketer", listingType, filters],
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

// //  useProperties.js
// import { useInfiniteQuery } from "@tanstack/react-query";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";

// const fetchListings = async ({ token, cursor = 0, listingType = "" }) => {
//   const { data } = await axiosInstance.get(
//     `api/v1/listings/cursor?limit=3&cursor=${cursor}&listing_type=${listingType}`,
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
//   console.log(data);

//   return data;
// };

// export const useProperties = (listingType) => {
//   const { user } = useAuth();

//   return useInfiniteQuery({
//     queryKey: ["listingsRealEstate", listingType],
//     queryFn: ({ pageParam = 0 }) =>
//       fetchListings({ token: user.token, cursor: pageParam, listingType }),
//     staleTime: 0,
//     cacheTime: 1000 * 60 * 5,
//     enabled: !!user?.token,
//     refetchOnWindowFocus: false,
//     getNextPageParam: (lastPage) =>
//       lastPage?.data?.pagination?.next_cursor ?? undefined,
//   });
// };
