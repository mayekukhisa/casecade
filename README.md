# Casecade

Casecade is a TypeScript utility for recursively transforming property names between `snake_case`, `camelCase`, and `PascalCase`. It does this while preserving your TypeScript types — meaning the transformed object structure is type-safe end-to-end.

This is perfect for reshaping API payloads or normalizing data structures across services that don’t always agree on casing. (And let's face it — they rarely do.)

Oh — and credit where credit's due: Casecade is inspired by [snakify-ts](https://www.npmjs.com/package/snakify-ts) and [camelize-ts](https://www.npmjs.com/package/camelize-ts). This project builds on their excellent ideas, but expands them into a more complete solution that covers multiple cases in one tool.

## Why Casecade?

You might wonder: there are already utilities out there that change casing. And that's true! But Casecade stands out because:

- It’s designed with TypeScript in mind: starting from `camelCase` (the TypeScript default) and making it easy to transform to APIs that expect `snake_case` or `PascalCase` — and just as easily transform API responses from `snake_case` or `PascalCase` back to `camelCase`.
- It supports deep, recursive transformation while keeping your types accurate — no more awkward casting or loose `any` types.
- It helps you avoid leaking `snake_case` or `PascalCase` structures into your TypeScript codebase.
- It works equally well for transforming objects at runtime and transforming TypeScript types at compile time.

## Installation

```shell
# npm
npm install casecade

# pnpm
pnpm add casecade

# yarn
yarn add casecade
```

## Basic Example

Say you get `snake_case` data from an API and want to transform it to `camelCase` for your frontend:

```ts
import { camelize } from "casecade"

const snakeCaseResponse = {
  user_id: 1,
  first_name: "Ada",
  last_name: "Lovelace",
  roles: ["admin", "editor"],
}

const userFromSnake = camelize(snakeCaseResponse)

console.log(userFromSnake.firstName) // "Ada"
console.log(userFromSnake.lastName) // "Lovelace"
```

Or maybe you get `PascalCase` data instead:

```ts
const pascalCaseResponse = {
  UserId: 1,
  FirstName: "Ada",
  LastName: "Lovelace",
  Roles: ["admin", "editor"],
}

const userFromPascal = camelize(pascalCaseResponse)

console.log(userFromPascal.firstName) // "Ada"
console.log(userFromPascal.lastName) // "Lovelace"
```

In both cases, you get properly typed `camelCase`. No `any`s sneaking in.

## Transforming to `snake_case`

When sending data back to an API that expects `snake_case`:

```ts
import { snakify } from "casecade"

const userInput = {
  userId: 1,
  firstName: "Ada",
  lastName: "Lovelace",
  roles: ["admin", "editor"],
}

const payload = snakify(userInput)

console.log(payload.first_name) // "Ada"
console.log(payload.last_name) // "Lovelace"
```

## Transforming to `PascalCase`

If you’re dealing with API endpoints that expect `PascalCase` — which happens sometimes — you can transform your TypeScript `camelCase` data like this:

```ts
import { pascalize } from "casecade"

const userInput = {
  userId: 1,
  firstName: "Ada",
  lastName: "Lovelace",
  roles: ["admin", "editor"],
}

const pascalPayload = pascalize(userInput)

console.log(pascalPayload.FirstName) // "Ada"
console.log(pascalPayload.LastName) // "Lovelace"
```

## Deeply Nested Structures

Nested objects and arrays are handled out of the box:

```ts
import { camelize } from "casecade"

const apiResponse = {
  user_id: 1,
  profile: {
    first_name: "Ada",
    last_name: "Lovelace",
    contact_info: {
      email_address: "ada@example.com",
    },
  },
  roles: ["admin", "editor"],
  posts: [
    { post_id: 101, post_title: "The Analytical Engine" },
    { post_id: 102, post_title: "Computing Numbers" },
  ],
}

const user = camelize(apiResponse)

console.log(user.profile.contactInfo.emailAddress) // "ada@example.com"
console.log(user.posts[0].postTitle) // "The Analytical Engine"
```

## Type Transformation Only (Without Data)

Sometimes you just want to transform the type, not the data:

```ts
import type { Camelize, Pascalize, Snakify } from "casecade"

type ApiResponse = {
  user_id: number
  first_name: string
  last_name: string
}

type FrontendUser = Camelize<ApiResponse>
// { userId: number; firstName: string; lastName: string }

type PascalApi = Pascalize<FrontendUser>
// { UserId: number; FirstName: string; LastName: string }

type SnakeAgain = Snakify<FrontendUser>
// { user_id: number; first_name: string; last_name: string }
```

## Good to Know: String Transformation

You can also transform simple strings between `camelCase`, `snake_case`, and `PascalCase`:

```ts
// Transform to camelCase
console.log(camelize("user_data")) // "userData"

// Transform to snake_case
console.log(snakify("userData")) // "user_data"

// Transform to PascalCase
console.log(pascalize("userData")) // "UserData"
```

## License

[MIT](LICENSE) — use it however you like.

&copy; 2025 Mayeku Khisa.
