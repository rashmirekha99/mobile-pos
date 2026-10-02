export type RootStackParamList = {
  Dashboard: undefined;
  ProductList: undefined;
  ProductForm: { productId?: number } | undefined;
  POS: undefined;
  Receipt: { saleId: number };
  DailyReport: undefined;
  Inventory: undefined;
  PrinterSettings: undefined;
  SupplierList: undefined;
  SupplierForm: { supplierId?: number } | undefined;
  GeneralSettings: undefined;
  ServiceList: undefined;
  ServiceForm: { serviceId?: number } | undefined;
  ServiceReport: undefined;
  SalesHistory: undefined;
  ServiceSalesHistory: undefined;
};
