export type IfunctionView = {
  name: string
  parameterTypes: Itype[]
  returnType: Itype
}
export type Itype =
  | 'string'
  | 'number'
  | 'boolean'
  | 'function'
  | 'object'
  | 'undefined'
  | 'null'
