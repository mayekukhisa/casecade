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

const tsConfig = {
  sourceMap: !isProduction,
  exclude: ["src/**/*.test.ts"],
}

export default defineConfig([
  // ESM build
  {
    input: "src/index.ts",
    output: {
      file: `${outputDir}/index.js`,
      format: "esm",
      sourcemap: !isProduction,
    },
    plugins: [
      del({
        targets: `${outputDir}/*`,
      }),
      typescript({
        ...tsConfig,
        declaration: true,
        declarationDir: typesOutputDir,
      }),
    ],
  },
  // CommonJS build
  {
    input: "src/index.ts",
    output: {
      file: `${outputDir}/index.cjs`,
      format: "cjs",
      sourcemap: !isProduction,
    },
    plugins: [typescript(tsConfig)],
  },
  // Type definitions
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
