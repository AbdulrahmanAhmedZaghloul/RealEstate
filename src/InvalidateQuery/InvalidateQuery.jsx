import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function InvalidateQuery({ queryKey }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [queryKey, queryClient]);

  return null; // مش هنعرض حاجة في UI
}
