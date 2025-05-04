/*
 * Copyright 2025 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import typescript from "@rollup/plugin-typescript"
import { defineConfig } from "rollup"
import del from "rollup-plugin-delete"

const isProduction = process.env.NODE_ENV === "production"
const outputDir = "dist"

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: outputDir,
    sourcemap: !isProduction,
  },
  plugins: [del({ targets: `${outputDir}/*` }), typescript({ sourceMap: !isProduction })],
})
