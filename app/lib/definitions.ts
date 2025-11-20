// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

// 证券交易复盘相关类型定义
export type StockIndex = {
  code: string;          // 指数代码（如 sh000001）
  name: string;          // 指数名称（如 上证指数）
  current: number;       // 当前点数
  change: number;        // 涨跌点数
  changePercent: number; // 涨跌幅百分比
  volume: number;        // 成交量（手）
  turnover: number;      // 成交额（万元）
  timestamp: string;     // 更新时间
};

export type StockItem = {
  code: string;          // 股票代码
  name: string;          // 股票名称
  current: number;       // 当前价
  change: number;        // 涨跌额
  changePercent: number; // 涨跌幅
  volume: number;        // 成交量
  turnover: number;      // 成交额
  high: number;          // 最高价
  low: number;           // 最低价
  open: number;          // 开盘价
  previousClose: number; // 昨收价
};

export type MarketSentiment = {
  upCount: number;       // 上涨家数
  downCount: number;     // 下跌家数
  flatCount: number;     // 平盘家数
  limitUpCount: number;  // 涨停家数
  limitDownCount: number;// 跌停家数
  totalTurnover: number; // 总成交额
  avgChangePercent: number; // 平均涨跌幅
};

export type KLineData = {
  date: string;          // 日期
  open: number;          // 开盘价
  close: number;         // 收盘价
  high: number;          // 最高价
  low: number;           // 最低价
  volume: number;        // 成交量
  turnover: number;      // 成交额
};

export type SectorData = {
  name: string;          // 板块名称
  changePercent: number; // 涨跌幅
  leadStock: string;     // 领涨股
  stockCount: number;    // 成分股数量
  totalTurnover: number; // 总成交额
};
