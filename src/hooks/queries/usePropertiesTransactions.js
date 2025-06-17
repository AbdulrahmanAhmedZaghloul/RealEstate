 


// usePropertiesTransactions.js
// import { useInfiniteQuery } from "@tanstack/react-query";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";

// const fetchListings = async ({ token, cursor = 0 }) => {
//   const { data } = await axiosInstance.get(`listings/pending?limit=3&cursor=${cursor}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   return data;
// };

// export const usePropertiesTransactions = () => {
//   const { user } = useAuth();

//   return useInfiniteQuery({
//     queryKey: ["listingsRealEstate-pending"],
//     queryFn: ({ pageParam = 0 }) =>
//       fetchListings({
//         token: user.token,
//         cursor: pageParam,
//       }),
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => {
//       console.log("Last Page Data:", lastPage);
      
//       // تأكد أن lastPage.pagination.next_cursor موجود
//       return lastPage?.data.pagination?.next_cursor ?? undefined;
//     },
//     enabled: !!user?.token,
//     refetchOnWindowFocus: false,
//   });
// };
 



// usePropertiesTransactions.js
// import { useInfiniteQuery } from "@tanstack/react-query";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";

// const fetchListings = async ({ token, cursor = 0, listingType = "all", sortBy = "created_at", sortDir = "desc" }) => {
//   let url = listingType === "all"
//     ? `listings/pending?limit=6&cursor=${cursor}`
//     : `listings/pending?listing_type=${listingType}&limit=6&cursor=${cursor}`;

//   // إضافة الفلاتر الجديدة
//   url += `&sort_by=${sortBy}&sort_dir=${sortDir}`;

//   const { data } = await axiosInstance.get(url, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   return data;
// };

// export const usePropertiesTransactions = (listingType = "all", sortBy = "created_at", sortDir = "desc") => {
//   const { user } = useAuth();

//   return useInfiniteQuery({
//     queryKey: ["listingsRealEstate-pending", listingType, sortBy, sortDir],
//     queryFn: ({ pageParam = 0 }) =>
//       fetchListings({
//         token: user.token,
//         cursor: pageParam,
//         listingType,
//         sortBy,
//         sortDir,
//       }),
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => {
//       return lastPage?.data?.pagination?.next_cursor ?? undefined;
//     },
//     enabled: !!user?.token,
//     refetchOnWindowFocus: false,
//   });
// };








import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const fetchListings = async ({
  token,
  cursor = 0,
  listingType = "all",
  sortBy = "created_at",
  sortDir = "desc",
  filters = {}
}) => {
  let url = new URL(`listings/pending`, window.location.origin);

  // إضافة الباراميتيرات الأساسية
  url.searchParams.append("limit", 6);
  url.searchParams.append("cursor", cursor);
  if (listingType !== "all") url.searchParams.append("listing_type", listingType);
  url.searchParams.append("sort_by", sortBy);
  url.searchParams.append("sort_dir", sortDir);

  // إضافة الفلاتر
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  const { data } = await axiosInstance.get(url.pathname + url.search, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};
export const usePropertiesTransactions = (
  listingType = "all",
  sortBy = "created_at",
  sortDir = "desc",
  filters = {}
) => {
  const { user } = useAuth();

  // نجعل enabled false ما لم يتم تفعيله من الخارج
  const [enabled, setEnabled] = useState(false);

  const query = useInfiniteQuery({
    queryKey: ["listingsRealEstate-pending", listingType, sortBy, sortDir, filters],
    queryFn: ({ pageParam = 0 }) =>
      fetchListings({
        token: user.token,
        cursor: pageParam,
        listingType,
        sortBy,
        sortDir,
        filters,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.pagination?.next_cursor ?? undefined;
    },
    enabled: !!user?.token && enabled, // ← هنا الشرط الجديد
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    enableQuery: () => setEnabled(true), // ← دالة لتفعيل الاستعلام
    resetQuery: () => {
      setEnabled(false); // ← لإعادة التعيين
    }
  };
};