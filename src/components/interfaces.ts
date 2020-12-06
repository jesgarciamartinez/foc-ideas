export type IsmallFunctionView = {
  name: string
  parameterTypes: Itype[]
  returnType: Itype
}

export type Ifunction = IsmallFunctionView & {
  code: string
  description: string
  contract?: string
}
// tests: [{params: [], return:}]

export type Itype =
  | 'string'
  | 'number'
  | 'boolean'
  | 'function'
  | 'object'
  | 'array'
  | 'undefined'
  | 'null'
