/*
 * Copyright 2025 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import typescript from "@rollup/plugin-typescript"
import { defineConfig } from "rollup"
import del from "rollup-plugin-delete"
import { dts } from "rollup-plugin-dts"

const isProduction = process.env.NODE_ENV === "production"

const outputDir = "dist"
const typesOutputDir = `${outputDir}/types`

export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      dir: outputDir,
      sourcemap: !isProduction,
    },
    plugins: [
      del({
        targets: `${outputDir}/*`,
      }),
      typescript({
        sourceMap: !isProduction,
        declaration: true,
        declarationDir: typesOutputDir,
        exclude: ["src/**/*.test.ts"],
      }),
    ],
  },
  {
    input: `${typesOutputDir}/index.d.ts`,
    output: {
      file: `${outputDir}/index.d.ts`,
    },
    plugins: [
      dts({
        compilerOptions: {
          paths: {
            "@/*": ["./src/*"],
          },
        },
      }),
      del({
        targets: typesOutputDir,
        hook: "buildEnd",
      }),
    ],
  },
])
