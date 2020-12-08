export type IsmallFunctionView = {
  name: string
  parameterTypes: Array<Itype['type']>
  returnType: Itype['type']
}

export type Ifunction = IsmallFunctionView & {
  code: string
  description: string
  contract?: string
}
// tests: [{params: [], return:}]

export type Itype =
  | { type: 'string' }
  | { type: 'number' }
  | { type: 'boolean'; value: boolean }
  | { type: 'function' }
  | { type: 'object' }
  | { type: 'array' }
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
