export type Operator =
  | '<'
  | '<='
  | '=='
  | '>'
  | '>='
  | '!='
  | 'array-contains'
  | 'array-contains-any'
  | 'in'
  | 'not-in';

export interface Query {
  field: string;
  operator: Operator;
  value: string | boolean;
}
