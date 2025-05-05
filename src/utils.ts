/*
 * Copyright 2025 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
export function toCamelCase(str: string): string {
  const result = str.replace(/_(\w|$)/g, (_, x) => x.toUpperCase())
  return result.charAt(0).toLowerCase() + result.slice(1)
}

export function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, (_, x) => `_${x.toLowerCase()}`)
}

export function walk<T>(obj: T, transformFn: (key: string) => string, shallow = false): any {
  if (!obj || typeof obj !== "object") return obj
  if (obj instanceof Date || obj instanceof RegExp) return obj

  if (Array.isArray(obj)) {
    return obj.map((v) => {
      if (!shallow) {
        return walk(v, transformFn)
      }
      if (typeof v === "object") return walk(v, transformFn, shallow)
      return v
    })
  }

  return Object.keys(obj).reduce(
    (res, key) => {
      const transformedKey = transformFn(key)
      res[transformedKey] = shallow ? (obj as any)[key] : walk((obj as any)[key], transformFn)
      return res
    },
    {} as Record<string, any>,
  )
}
