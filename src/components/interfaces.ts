// export type IfunctionDefinition = {
//   name: string
//   parameterTypes: Array<Itype['type']>
//   returnType: Itype['type']
//   code: string
//   description: string
//   contract?: string
// }

export type Ifunction = {
  name: string
  parameters: Array<Itype>
  returns: Itype
  fn: Function
  description: string
  contract?: string
}
// tests: [{params: [], return:}]

export type Itype =
  | { type: 'string'; value?: any }
  | { type: 'number'; value?: any }
  | { type: 'boolean'; value?: any }
  | { type: 'function'; value?: any }
  | { type: 'object'; value?: any }
  | { type: 'array'; of: Itype | { typeParam: string }; value?: any }
  | { type: 'undefined'; value?: any }
  | { type: 'null'; value?: any }

export type Ieffect = {
  name: string
}
