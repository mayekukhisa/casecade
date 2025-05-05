/*
 * Copyright 2025 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import { Camelize, camelize } from "@/index"

describe("camelize", () => {
  describe("shallow", () => {
    it("should convert snake_case string to camelCase", () => {
      expect(camelize("dat_string", true)).toBe("datString")
    })

    it("should not modify string values in arrays", () => {
      expect(camelize(["dat_string", "other_string"], true)).toEqual(["dat_string", "other_string"])
    })

    it("should preserve Date and RegExp objects", () => {
      const regExp = new RegExp(/.*/)
      const date = new Date(0)

      expect(
        camelize(
          {
            a_key: 1,
            b: {
              numb_erty: 123,
              dat_erty: date,
              regexp_erty: regExp,
            },
          },
          true,
        ),
      ).toEqual({
        aKey: 1,
        b: {
          numb_erty: 123,
          dat_erty: date,
          regexp_erty: regExp,
        },
      })
    })

    it("should convert object property names to camelCase", () => {
      expect(camelize({ a_key: 1, b_key: 2 }, true)).toEqual({ aKey: 1, bKey: 2 })
    })

    it("should not convert nested object property names when shallow", () => {
      expect(camelize({ a_key: { b_key: 2 } }, true)).toEqual({ aKey: { b_key: 2 } })
    })

    it("should handle nested optional properties", () => {
      type T = {
        one_a?: string
        one_b?: {
          two_a?: string
          two_b?: {
            three_a?: string
          }
        }
      }

      const t: Camelize<T, true> = {
        oneA: "string",
        oneB: {
          two_a: "string",
          two_b: {
            three_a: "c",
          },
        },
      }

      expect(t.oneB?.two_b?.three_a).toBe("c")
    })

    it("should convert array of objects with shallow transformation", () => {
      expect(camelize([{ foo_bar: { bar_foo: 123 } }], true)[0].fooBar.bar_foo).toBe(123)
    })
  })

  describe("deep", () => {
    it("should convert snake_case string to camelCase", () => {
      expect(camelize("dat_string")).toBe("datString")
    })

    it("should not modify string values in arrays", () => {
      expect(camelize(["dat_string", "other_string"])).toEqual(["dat_string", "other_string"])
    })

    it("should preserve Date and RegExp objects in nested structures", () => {
      const regExp = new RegExp(/.*/)
      const date = new Date(0)

      expect(
        camelize({
          a_key: 1,
          b: {
            numb_erty: 123,
            dat_erty: date,
            regexp_erty: regExp,
          },
        }),
      ).toEqual({
        aKey: 1,
        b: {
          numbErty: 123,
          datErty: date,
          regexpErty: regExp,
        },
      })
    })

    it("should convert object property names to camelCase", () => {
      expect(camelize({ a_key: 1, b_key: 2 })).toEqual({ aKey: 1, bKey: 2 })
    })

    it("should convert nested object property names recursively", () => {
      expect(camelize({ a_key: { b_key: 2 } })).toEqual({ aKey: { bKey: 2 } })
    })

    it("should handle complex objects with arrays and nested values", () => {
      expect(
        camelize({
          a_key: {
            strings_in_a_list: ["dat_string", "other_string"],
            b: { a_key: 123 },
          },
        }),
      ).toEqual({
        aKey: {
          stringsInAList: ["dat_string", "other_string"],
          b: { aKey: 123 },
        },
      })
    })

    it("should convert deeply nested objects in array properties", () => {
      const camelized = camelize({
        a_key: {
          a_list: [
            {
              a_nested_value: 123,
              a_deeply_nested_object: {
                a_deeeeeply_nested_value: "foo",
                a_deeply_nested_object: {
                  a_deeeeeply_nested_value: "foo",
                  a_deeply_nested_object: {
                    a_deeeeeply_nested_value: "foo",
                  },
                },
              },
            },
          ],
        },
      })

      expect(camelized.aKey.aList[0].aDeeplyNestedObject.aDeeplyNestedObject.aDeeeeeplyNestedValue).toEqual("foo")
    })

    it("should handle nested optional properties with deep transformation", () => {
      type T = {
        one_a?: string
        one_b?: {
          two_a?: string
          two_b?: {
            three_a?: string
          }
        }
      }

      const t: Camelize<T> = {
        oneA: "string",
        oneB: {
          twoA: "string",
          twoB: {
            threeA: "c",
          },
        },
      }

      expect(t.oneB?.twoB?.threeA).toBe("c")
    })

    it("should convert mixed case keys to camelCase", () => {
      type T = {
        UpperCaseKey: string
        lowerCaseKey: {
          NestedKey: string
          optionalKey?: string
        }
        Snake_Key: {
          NestedKey: string
        }
      }

      const t = camelize<T>({
        UpperCaseKey: "string",
        lowerCaseKey: {
          NestedKey: "value1",
          optionalKey: "string",
        },
        Snake_Key: {
          NestedKey: "value2",
        },
      })

      expect(t.upperCaseKey).toBe("string")
      expect(t.lowerCaseKey.nestedKey).toBe("value1")
      expect(t.snakeKey.nestedKey).toBe("value2")
    })
  })
})
