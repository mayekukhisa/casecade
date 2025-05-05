/*
 * Copyright 2025 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
type CamelCase<S extends string> = S extends `${infer T}_${infer U}${infer V}`
  ? `${T}${Uppercase<U>}${CamelCase<V>}`
  : S

type CamelizeObject<T, S = false> = {
  [K in keyof T as Uncapitalize<CamelCase<string & K>>]: T[K] extends Date
    ? T[K]
    : T[K] extends RegExp
      ? T[K]
      : T[K] extends Array<infer U>
        ? U extends object | undefined
          ? Array<CamelizeObject<U>>
          : T[K]
        : T[K] extends object | undefined
          ? S extends true
            ? T[K]
            : CamelizeObject<T[K]>
          : T[K]
}

/**
 * Transforms type property names from snake_case or PascalCase to camelCase
 * @param T - The type to transform
 * @param S - If true, only transform the top level properties
 * @returns The transformed type
 */
export type Camelize<T, S = false> = T extends Array<infer U> ? Array<CamelizeObject<U, S>> : CamelizeObject<T, S>

function toCamelCase(str: string): string {
  const result = str.replace(/_(\w|$)/g, (_, x) => x.toUpperCase())
  return result.charAt(0).toLowerCase() + result.slice(1)
}

function walk<T>(obj: T, shallow = false): any {
  if (!obj || typeof obj !== "object") return obj
  if (obj instanceof Date || obj instanceof RegExp) return obj

  if (Array.isArray(obj)) {
    return obj.map((v) => {
      if (!shallow) {
        return walk(v)
      }
      if (typeof v === "object") return walk(v, shallow)
      return v
    })
  }

  return Object.keys(obj as object).reduce(
    (res, key) => {
      const transformedKey = toCamelCase(key)
      res[transformedKey] = shallow ? (obj as any)[key] : walk((obj as any)[key])
      return res
    },
    {} as Record<string, any>,
  )
}

/**
 * Transforms object property names from snake_case or PascalCase to camelCase
 * @param obj - The object to transform
 * @param shallow - If true, only transform the top level properties
 * @returns The transformed object
 */
export function camelize<T, S extends boolean = false>(
  obj: T,
  shallow?: S,
): T extends string ? string : Camelize<T, S> {
  return typeof obj === "string" ? (toCamelCase(obj) as any) : (walk(obj, shallow) as any)
}
