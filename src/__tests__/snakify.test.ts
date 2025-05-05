/*
 * Copyright 2025 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import { Snakify, snakify } from "@/index"

describe("snakify", () => {
  describe("shallow", () => {
    it("should convert camelCase string to snake_case", () => {
      expect(snakify("datString", true)).toBe("dat_string")
    })

    it("should not modify string values in arrays", () => {
      expect(snakify(["datString", "otherString"], true)).toEqual(["datString", "otherString"])
    })

    it("should preserve Date and RegExp objects", () => {
      const regExp = new RegExp(/.*/)
      const date = new Date(0)

      expect(
        snakify(
          {
            aKey: 1,
            b: {
              numbErty: 123,
              datErty: date,
              regexpErty: regExp,
            },
          },
          true,
        ),
      ).toEqual({
        a_key: 1,
        b: {
          numbErty: 123,
          datErty: date,
          regexpErty: regExp,
        },
      })
    })

    it("should convert object keys to snake_case", () => {
      expect(snakify({ aKey: 1, bKey: 2 }, true)).toEqual({ a_key: 1, b_key: 2 })
    })

    it("should not convert nested object keys when shallow", () => {
      expect(snakify({ aKey: { bKey: 2 } }, true)).toEqual({ a_key: { bKey: 2 } })
    })

    it("should handle nested optional properties", () => {
      type T = {
        oneA?: string
        oneB?: {
          twoA?: string
          twoB?: {
            threeA?: string
          }
        }
      }

      const t: Snakify<T, true> = {
        one_a: "string",
        one_b: {
          twoA: "string",
          twoB: {
            threeA: "c",
          },
        },
      }

      expect(t.one_b?.twoB?.threeA).toBe("c")
    })

    it("should convert array of objects with shallow transformation", () => {
      expect(snakify([{ fooBar: { barFoo: 123 } }], true)[0].foo_bar.barFoo).toBe(123)
    })
  })

  describe("deep", () => {
    it("should convert camelCase string to snake_case", () => {
      expect(snakify("datString")).toBe("dat_string")
    })

    it("should not modify string values in arrays", () => {
      expect(snakify(["datString", "otherString"])).toEqual(["datString", "otherString"])
    })

    it("should preserve Date and RegExp objects in nested structures", () => {
      const regExp = new RegExp(/.*/)
      const date = new Date(0)

      expect(
        snakify({
          aKey: 1,
          b: {
            numbErty: 123,
            datErty: date,
            regexpErty: regExp,
          },
        }),
      ).toEqual({
        a_key: 1,
        b: {
          numb_erty: 123,
          dat_erty: date,
          regexp_erty: regExp,
        },
      })
    })

    it("should convert object keys to snake_case", () => {
      expect(snakify({ aKey: 1, bKey: 2 })).toEqual({ a_key: 1, b_key: 2 })
    })

    it("should convert nested object keys recursively", () => {
      expect(snakify({ aKey: { bKey: 2 } })).toEqual({ a_key: { b_key: 2 } })
    })

    it("should handle complex objects with arrays and nested values", () => {
      expect(
        snakify({
          aKey: {
            stringsInAList: ["dat_string", "other_string"],
            b: { aKey: 123 },
          },
        }),
      ).toEqual({
        a_key: {
          strings_in_a_list: ["dat_string", "other_string"],
          b: { a_key: 123 },
        },
      })
    })

    it("should convert deeply nested objects in array properties", () => {
      const snakified = snakify({
        aKey: {
          aList: [
            {
              aNestedValue: 123,
              aDeeplyNestedObject: {
                aDeeeeeplyNestedValue: "foo",
                aDeeplyNestedObject: {
                  aDeeeeeplyNestedValue: "foo",
                  aDeeplyNestedObject: {
                    aDeeeeeplyNestedValue: "foo",
                  },
                },
              },
            },
          ],
        },
      })

      expect(snakified.a_key.a_list[0].a_deeply_nested_object.a_deeply_nested_object.a_deeeeeply_nested_value).toEqual(
        "foo",
      )
    })

    it("should handle nested optional properties with deep transformation", () => {
      type T = {
        oneA?: string
        oneB?: {
          twoA?: string
          twoB?: {
            threeA?: string
          }
        }
      }

      const t: Snakify<T> = {
        one_a: "string",
        one_b: {
          two_a: "string",
          two_b: {
            three_a: "c",
          },
        },
      }

      expect(t.one_b?.two_b?.three_a).toBe("c")
    })
  })
})
