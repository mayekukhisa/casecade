/*
 * Copyright 2025 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import { Pascalize, pascalize } from "@/index"

describe("pascalize", () => {
  describe("shallow", () => {
    it("should convert camelCase string to PascalCase", () => {
      expect(pascalize("datString", true)).toBe("DatString")
    })

    it("should not modify string values in arrays", () => {
      expect(pascalize(["datString", "otherString"], true)).toEqual(["datString", "otherString"])
    })

    it("should preserve Date and RegExp objects", () => {
      const regExp = new RegExp(/.*/)
      const date = new Date(0)

      expect(
        pascalize(
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
        AKey: 1,
        B: {
          numbErty: 123,
          datErty: date,
          regexpErty: regExp,
        },
      })
    })

    it("should convert object keys to PascalCase", () => {
      expect(pascalize({ aKey: 1, bKey: 2 }, true)).toEqual({ AKey: 1, BKey: 2 })
    })

    it("should not convert nested object keys when shallow", () => {
      expect(pascalize({ aKey: { bKey: 2 } }, true)).toEqual({ AKey: { bKey: 2 } })
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

      const t: Pascalize<T, true> = {
        OneA: "string",
        OneB: {
          twoA: "string",
          twoB: {
            threeA: "c",
          },
        },
      }

      expect(t.OneB?.twoB?.threeA).toBe("c")
    })

    it("should convert array of objects with shallow transformation", () => {
      expect(pascalize([{ fooBar: { barFoo: 123 } }], true)[0].FooBar.barFoo).toBe(123)
    })
  })

  describe("deep", () => {
    it("should convert camelCase string to PascalCase", () => {
      expect(pascalize("datString")).toBe("DatString")
    })

    it("should not modify string values in arrays", () => {
      expect(pascalize(["datString", "otherString"])).toEqual(["datString", "otherString"])
    })

    it("should preserve Date and RegExp objects in nested structures", () => {
      const regExp = new RegExp(/.*/)
      const date = new Date(0)

      expect(
        pascalize({
          aKey: 1,
          b: {
            numbErty: 123,
            datErty: date,
            regexpErty: regExp,
          },
        }),
      ).toEqual({
        AKey: 1,
        B: {
          NumbErty: 123,
          DatErty: date,
          RegexpErty: regExp,
        },
      })
    })

    it("should convert object keys to PascalCase", () => {
      expect(pascalize({ aKey: 1, bKey: 2 })).toEqual({ AKey: 1, BKey: 2 })
    })

    it("should convert nested object keys recursively", () => {
      expect(pascalize({ aKey: { bKey: 2 } })).toEqual({ AKey: { BKey: 2 } })
    })

    it("should handle complex objects with arrays and nested values", () => {
      expect(
        pascalize({
          aKey: {
            stringsInAList: ["datString", "otherString"],
            b: { aKey: 123 },
          },
        }),
      ).toEqual({
        AKey: {
          StringsInAList: ["datString", "otherString"],
          B: { AKey: 123 },
        },
      })
    })

    it("should convert deeply nested objects in array properties", () => {
      const pascalized = pascalize({
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

      expect(pascalized.AKey.AList[0].ADeeplyNestedObject.ADeeplyNestedObject.ADeeeeeplyNestedValue).toEqual("foo")
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

      const t: Pascalize<T> = {
        OneA: "string",
        OneB: {
          TwoA: "string",
          TwoB: {
            ThreeA: "c",
          },
        },
      }

      expect(t.OneB?.TwoB?.ThreeA).toBe("c")
    })
  })
})
