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
  | { type: 'string'; value?: any }
  | { type: 'number'; value?: any }
  | { type: 'boolean'; value?: any }
  | { type: 'function'; value?: any }
  | { type: 'object'; value?: any }
  | { type: 'array'; of: Itype | { typeParam: string }; value?: any }
  | { type: 'undefined'; value?: any }
  | { type: 'null'; value?: any }

export type ItypeView = {
  name: string
  type: string
  typeParameters?: Array<string>
}

export type Ieffect = {
  name: string
}
