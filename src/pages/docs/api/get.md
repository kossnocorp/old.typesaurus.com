---
title: get
description: get function reference
---

## TL;DR

Use `get` to retreive a document by id from a collection.

```ts
import { schema } from 'typesaurus'

interface User {
  name: string
}

const db = schema(($) => ({
  users: $.collection<User>(),
}))

const sasha = await db.users.get('sasha')

console.log(sasha.data.name)
//=> "Sasha"
```

Hello world!
