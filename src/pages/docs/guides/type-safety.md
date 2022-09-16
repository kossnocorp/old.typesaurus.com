---
title: Type safety
description: TODO
---

## Recommended config

---

## Schema types

---

## `undefined` & `null`

---

## Typed ids

Often databases have similarily sounding entities, e.g., user and account. To prevent developers from mixing those and introducing stealthy bugs, Typesaurus makes all ids typed.

By default a collection have an id corresponding to its path.

```ts
import { schema } from 'typesaurus'

const db = schema(($) => {
  users: $.collection<User>(),
  accounts: $.collection<Account>().sub({
    reports: $.collection<Report>()
  })
})
```

In the given example, the user document id is `Id<'users'>`, and the account reports subcollection document id is `Id<'users/reports'>`.

Mixing types or trying to use a `string` will cause TypeScript to complain about it:

```ts
db.users.update(accountId, { name: 'Sasha' })
// Argument of type 'Id<"accounts">' is not assignable to parameter of type 'Id<"users">'.
```

### Creating id

If you need to convert a string to an id or create a new random id, you can use a collection method `id`:

```ts
// Convert string to an id:
const userId = db.users.id('sasha')

// Create a new random id:
const newUserId = await db.users.id()
```

[Read more about the collection method `id`](/docs/api/collection#id).

### Id type

You can access any document id type, using the inferred schema types ([read more about schema types](#schema-types)):

```ts
function removeAccount(accountId: Schema['accounts']['Id']) {
  return db.accounts.remove(accountId)
}

function publishReport(reportId: Schema['accounts']['reports']['Id']) {
  return db.accounts.reports.update(reportId, { published: true })
}
```

Essentially `Id` is an opaque `string` with the path mixed to it so that TypeScript can distinguish those. However, the type system will complain if you try to use it as a string, so you'll need to cast it using `.toString` first:

```ts
function logId(id: string) {
  console.log(`The id is ${id}`)
}

logId(accountId.toString())
```

### Shared ids

If your collections share ids, i.e. you use the organization id to store subscription document, you can define custom id and make collections share id:

```ts
import { schema, Typesaurus } from 'typesaurus'

const db = schema(($) => {
  organizations: $.collection<Organization>(),
  subscriptions: $.collection<Subscription, Typesaurus.Id<'organizations'>>()
})
```

Now, you'll be able to use the organization id to operate on subscription document:

```ts
function removeOrganization(organizationId: Schema['organizations']['Id']) {
  return Promise.all([
    db.organizations.remove(organizationId),
    db.subscriptions.remove(organizationId),
  ])
}
```

[Read more about `Id` type](/docs/api/type/id).

### Static ids

Some collections have a finite number of documents, i.e., global application stats. For those cases, you can define custom string ids:

```ts
import { schema } from 'typesaurus'

const db = schema(($) => {
  regionStats: $.collection<RegionStats, 'us' | 'europe' | 'asia'>()
})

db.regionStats.update('us', ($) => {
  online: $.increment(1)
})
```

---

## Server dates

---

## Safe paths

Besides preventing runtime errors, preserving data consistency is another big focus of Typesaurus.

Of the ways data can become inconsistent is through partial updates. While checking if the whole document is set correctly is a reasonably simple task, verifying if a single field update won't cause an inconsistency is challenging.

That's why Typesaurus incorporates safe path checks on updates that prevent field updates that would get your documents into an impossible state.

To understand the problem and how safe paths work, let's take a look at an example:
