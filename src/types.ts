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

type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${SnakeCase<U>}`
  : S

type SnakifyObject<T, S = false> = {
  [K in keyof T as SnakeCase<string & K>]: T[K] extends Date
    ? T[K]
    : T[K] extends RegExp
      ? T[K]
      : T[K] extends Array<infer U>
        ? U extends object | undefined
          ? Array<SnakifyObject<U>>
          : T[K]
        : T[K] extends object | undefined
          ? S extends true
            ? T[K]
            : SnakifyObject<T[K]>
          : T[K]
}

/**
 * Transforms type property names from camelCase to snake_case
 * @param T - The type to transform
 * @param S - If true, only transform the top level properties
 * @returns The transformed type
 */
export type Snakify<T, S = false> = T extends Array<infer U> ? Array<SnakifyObject<U, S>> : SnakifyObject<T, S>

type PascalCase<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S

type PascalizeObject<T, S = false> = {
  [K in keyof T as PascalCase<string & K>]: T[K] extends Date
    ? T[K]
    : T[K] extends RegExp
      ? T[K]
      : T[K] extends Array<infer U>
        ? U extends object | undefined
          ? Array<PascalizeObject<U>>
          : T[K]
        : T[K] extends object | undefined
          ? S extends true
            ? T[K]
            : PascalizeObject<T[K]>
          : T[K]
}

/**
 * Transforms type property names from camelCase to PascalCase
 * @param T - The type to transform
 * @param S - If true, only transform the top level properties
 */
export type Pascalize<T, S = false> = T extends Array<infer U> ? Array<PascalizeObject<U, S>> : PascalizeObject<T, S>
