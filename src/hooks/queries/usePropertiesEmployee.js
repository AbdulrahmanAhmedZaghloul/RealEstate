// useProperties.js
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const fetchListings = async ({
  token,
  cursor = 0,
  listing_type = "all",
  sortBy = "newest",
  filters = {},
  searchTerm = "",
}) => {
  let sort_by = "";
  let sort_dir = "";

  switch (sortBy) {
    case "newest":
      sort_by = "created_at";
      sort_dir = "desc";
      break;
    case "oldest":
      sort_by = "created_at";
      sort_dir = "asc";
      break;
    case "highest":
      sort_by = "price";
      sort_dir = "desc";
      break;
    case "lowest":
      sort_by = "price";
      sort_dir = "asc";
      break;
    default:
      sort_by = "created_at";
      sort_dir = "desc";
  }

  const params = {
    limit: 6,
    cursor,
    sort_by,
    sort_dir,
    ...filters,
  };

  if (listing_type !== "all") {
    params.listing_type = listing_type;
  }

  if (searchTerm) {
    params.search = searchTerm; // 👈 إرسال مصطلح البحث إلى الـ API
  }

  const { data } = await axiosInstance.get("listings/employee", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return data;
}; 



export const usePropertiesEmployee = (
  listing_type = "all",
  sortBy = "newest",
  filters = {},
  searchTerm = ""
) => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ["listingsRealEstate-employee", listing_type, sortBy, filters, searchTerm],
    queryFn: ({ pageParam = 0 }) =>
      fetchListings({
        token: user.token,
        cursor: pageParam,
        listing_type,
        sortBy,
        filters,
        searchTerm,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data?.pagination?.next_cursor ?? undefined;
    },
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
    enabled: !!user?.token,
    refetchOnWindowFocus: false,
  });
};
 