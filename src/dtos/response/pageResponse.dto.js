import { responseDto } from "./response.dto.js";

export function paginateDto(
  items,
  total,
  page,
  limit,
  message = "Fetched successfully"
) {
  const totalPages = Math.ceil(total / limit);
  return responseDto(
    {
      items,
      pagination: { total, page, limit, totalPages },
    },
    message,
    200
  );
}
