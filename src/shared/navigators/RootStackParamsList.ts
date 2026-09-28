export type RootStackParamList = {
  Dashboard: undefined;
  ProductList: undefined;
  ProductForm: { productId?: number } | undefined;
  POS: undefined;
  Receipt: { saleId: number };
  DailyReport: undefined;
  Inventory: undefined;
};
