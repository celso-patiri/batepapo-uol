const responseData = (isError, message, data) => {
  if (isError) return { isError, message };
  return { isError, message, data };
};

export default responseData;
