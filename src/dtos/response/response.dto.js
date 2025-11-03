export const responseDto = (data, message = "Success", status = 200) => {
  return {
    status,
    message,
    data,
    success: status >= 200 && status < 400,
  };
};
