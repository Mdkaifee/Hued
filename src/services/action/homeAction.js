export const getOrdersApi = async data => {
  try {
    const response = await AxiosBase.get(
      `vendor/store/venderOrders?page=${data.page}&limit=${data.limit}&search=${data.search}&startDate=${data.startDate}&endDate=${data.endDate}`,
    );
    return response;
  } catch (error) {
    if (error.response.data.data !== undefined) {
      showError(error.response.data.data);
    } else {
      showError(error.response.data.message);
    }
    console.error(error);
    return error;
  }
};
