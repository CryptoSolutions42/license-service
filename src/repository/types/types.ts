import { Order } from 'ccxt';

export type OrderType = {
  id: number;
  orderId: string;
  order: Order;
  createAt: number;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  symbol: string;
  isActive: number;
};

export type CreateOrderParamsType = Pick<OrderType, 'orderId' | 'order' | 'price' | 'amount' | 'side' | 'symbol'> & {
  indexOperation: string;
};

export type TableNameType =
  | 'trade_operation'
  | 'balance_history'
  | 'trade_session'
  | 'trade_config'
  | 'license'
  | 'process_indexer';

export type ValueType = {
  column: string;
  value: string | number;
};
type WhereType = ValueType;

export type UpdateQueryParamType = {
  tableName: TableNameType;
  value: ValueType[];
  where?: WhereType[];
  operationCondition?: 'and' | 'or';
};

export type InsertQueryParamType = Pick<UpdateQueryParamType, 'tableName'> & {
  value: ValueType[];
};

export type SelectQueryParamType = Pick<UpdateQueryParamType, 'tableName' | 'where' | 'operationCondition'> & {
  column: string[];
};

export type WhereGenerationParamType = Pick<UpdateQueryParamType, 'operationCondition' | 'where'>;
export type ValueGenerationParamType = ValueType;

export type CreateStateBalanceParamType = {
  usdt: number;
  eth: number;
  btc: number;
  profitAll: number;
  exchangeName: string;
  updateDate?: Date | string;
  profitEth: number;
  profitUsdt: number;
  profitPercent: number;
  apiKey?: string;
  privateKey?: string;
  password?: string;
};

export type ConfigRepositoryType = {
  symbol: string;
  positionSize: number;
  countGridSize: number | null;
  gridSize: number | null;
  percentBuyBackStep: number;
  takeProfit: number | null;
  stopLoss: number | null;
  isEmergencyStop: boolean;
  percentProfit: number;
  percentFromBalance: number;
  candlePriceRange: string;
  isPercentTargetAfterTakeProfit: boolean;
  percentTargetAfterTakeProfit: number;
  balanceDistribution: boolean;
  exchange: 'okx';
};

export type BalanceStateType = Omit<CreateStateBalanceParamType, 'exchangeName' | 'updateDate'>;

export type SessionType = {
  indexSession: string;
  isActive: boolean;
};

export enum ColumnName {
  id = 'id',
  //balance_history
  usdt = 'usdt',
  eth = 'eth',
  btc = 'btc',
  profitAll = 'profit_all',
  exchangeName = 'exchange_name',
  updateDate = 'update_date',
  profitEth = 'profit_eth',
  profitUsdt = 'profit_usdt',
  profitPercent = 'profit_percent',
  apiKey = 'api_key',
  privateKey = 'private_key',
  //trading_operation
  symbol = 'symbol',
  orderId = 'order_id',
  order = '"order"',
  price = 'price',
  amount = 'amount',
  side = 'side',
  indexOperation = 'index_operation',
  createAt = 'create_at',
  isActive = 'is_active',
  //trade_session
  indexSession = 'index_session',
  profitSession = 'profit_session',
  //trade_config
  positionSize = 'position_size',
  countGridSize = 'count_grid_size',
  gridSize = 'grid_size',
  percentBuyBack = 'percent_buy_back',
  takeProfit = 'take_profit',
  stopLoss = 'stop_loss',
  isEmergencyStop = 'is_emergency_stop',
  percentProfit = 'percent_profit',
  percentFromBalance = 'percent_from_balance',
  candlePriceRange = 'candle_price_range',
  percentTargetAfterTakeProfit = 'percent_target_after_take_profit',
}
