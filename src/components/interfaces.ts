export type IsmallFunctionView = {
  name: string
  parameterTypes: Array<Itype['type']>
  returnType: Itype['type']
}

export type Ifunction = IsmallFunctionView & {
  name: string
  parameters: Array<Itype>
  code: string
  description: string
  contract?: string
}
// tests: [{params: [], return:}]

export type Itype =
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'function'; value: any }
  | { type: 'object'; value: object }
  | { type: 'array'; of: Itype; value: any }
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
