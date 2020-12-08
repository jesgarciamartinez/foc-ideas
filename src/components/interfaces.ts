// export type IfunctionDefinition = {
//   name: string
//   parameterTypes: Array<Itype['type']>
//   returnType: Itype['type']
//   code: string
//   description: string
//   contract?: string
// }
type Iparameter = Itype & { parameterName: string }

export type Ifunction = {
  name: string
  parameters: Array<Iparameter>
  returns: Itype
  code: string
  description: string
  contract?: string
}
// tests: [{params: [], return:}]

export type Itype =
  | { type: 'string'; value?: string }
  | { type: 'number'; value?: number }
  | { type: 'boolean'; value?: boolean }
  | { type: 'function'; value?: any }
  | { type: 'object'; value?: object }
  | { type: 'array'; of: Itype | { typeParam: string }; value?: any }
  | { type: 'undefined' }
  | { type: 'null' }

export type ItypeView = {
  name: string
  type: string
  typeParameters?: Array<string>
}

export type Ieffect = {
  name: string
}
