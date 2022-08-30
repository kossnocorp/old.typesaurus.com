---
title: all
description: all function reference
---

## TL;DR

Use `all` to retreive all documents from a collection.

```ts
import { schema } from 'typesaurus'

interface User {
  name: string
}

const db = schema(($) => ({
  users: $.collection<User>(),
}))

const users = await db.users.all()
```

Hello world!
