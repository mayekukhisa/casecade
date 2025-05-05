/*
 * Copyright 2025 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import { Camelize, Pascalize, Snakify } from "@/types"
import { toCamelCase, toPascalCase, toSnakeCase, walk } from "@/utils"

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
  return typeof obj === "string" ? (toCamelCase(obj) as any) : (walk(obj, toCamelCase, shallow) as any)
}

/**
 * Transforms object property names from camelCase to snake_case
 * @param obj - The object to transform
 * @param shallow - If true, only transform the top level properties
 * @returns The transformed object
 */
export function snakify<T, S extends boolean = false>(obj: T, shallow?: S): T extends string ? string : Snakify<T, S> {
  return typeof obj === "string" ? (toSnakeCase(obj) as any) : (walk(obj, toSnakeCase, shallow) as any)
}

/**
 * Transforms object property names from camelCase to PascalCase
 * @param obj - The object to transform
 * @param shallow - If true, only transform the top level properties
 * @returns The transformed object
 */
export function pascalize<T, S extends boolean = false>(
  obj: T,
  shallow?: S,
): T extends string ? string : Pascalize<T, S> {
  return typeof obj === "string" ? (toPascalCase(obj) as any) : (walk(obj, toPascalCase, shallow) as any)
}

export type { Camelize, Pascalize, Snakify }
