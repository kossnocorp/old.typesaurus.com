---
title: Designing schema
description: Desinging Firestore database schema with Typesaurus
---

In this guide, you'll learn the designing schema best practices. I will teach you how to write easy-to-maintain types that consider Firestore specifics. {% .lead %}

## Interfaces over aliases

## Various shapes

## Field groups

---

## Sharing ids

Sometimes it's a good idea to have the same ids for 1:1 relations between collections. Say you have a document with a Twitter account data (username, avatar, etc.), storing the API credentials along with it will be a security breach, so you need to create a separate collection for that. In this case, using the same id for the account and the credentials absolutely makes sense:

```ts
import { schema, Typesaurus } from 'typesaurus'

const db = schema(($) => ({
  accounts: $.collection<Account>(),
  credentials: $.collection<Credentials, Typesaurus.Id<'accounts'>>(),
}))
```

We defined the credentials collection in the example with `Typesaurus.Id<'accounts'>` id. Both collection ids can now be interchangeable.

[Learn more about shared ids](/docs/guides/type-safety#shared-ids).

{% callout title="Don't abuse shared ids!" %}
If two related documents have the same permissions and you need to download them together, they should be one document.

It might be tempting to separate user profiles and settings, but in most cases, it will be beneficial for the end user to keep them as a single document as they both needed to display an app. Also, it's twice as less reads that you pay for
{% /callout %}

---

## Single-document collections

It's ok to create a dedicated collection to store a single document in it. For example, you might need store global app stats:

```ts
import { schema } from 'typesaurus'

interface AppStats {
  users?: number
  online?: number
}

const db = schema(($) => ({
  appStats: $.collection<AppStats, 'stats'>(),
}))

// ...later:
await db.appStats.update('stats', ($) => {
  users: $.increment(1)
})
```

We created `appStats` collection with static id `stats`. This will let Typesaurus know that you can write and read only a single document in the collection.

[Learn more about static ids](/docs/guides/type-safety#static-ids).

---

## Updatability

It might be tempting to make as many fields required as possible to avoid extra checks. After all, we're trying to achieve type safety, don't we?

That's right, but we also want to keep our data consistent, and when we update it, we must be sure it never gets into an impossible state, and here the problem lies.

Let's take a look at a given schema:

```ts
import { schema } from 'typesaurus'

interface Organization {
  counters?: {
    drafts: number
    scheduled: number
    published: number
  }
}

const db = schema(($) => ({ organizations: $.collection<Organization>() }))
```

We want to keep an organization's number of drafts and scheduled and published posts.

In the example we've made `counters` optional as we don't want to bootstrap it when we create an organization, but we made `drafts`, `scheduled`, and `published` fields required so when `counters` is set, we can be sure they all defined.

For example once a post is scheduled, we want to increment the `scheduled` field:

```ts
db.organizations.update(orgId, ($) =>
  $.field('counters, 'scheduled').set($.increment(1))
)
```

Sounds easy enough, right?

The problem here is that setting `counters` this way for the first time will break data consistently and lead to something like this:

```json
{
  "counters": {
    "scheduled": 1
  }
}
```

You can see that `drafts` and `published` are missing, which don't correspond with our types where those fields are required.

That's why Typesaurus **doesn't allow** updates like this:

```ts
const folderId = 'folder-id'

db.organizations.update(
  orgId,
  ($) => $.field('counters', 'scheduled').set($.increment(1))
  //                         ^^^^^^^^^^^
  // Argument of type 'string' is not assignable to parameter of type 'never'.
)
```

Typesaurus checks if the path is safe to update and won't cause inconsistency, and if not, it shows a type error.

So, to make single field update possible, we should make all fields optional:

```ts
interface Organization {
  counters?: {
    drafts?: number
    scheduled?: number
    published?: number
  }
}
```

It will make the data harder to consume as we'll need to add additional checks before using the counters, but it will make updating it way easier. It's a balancing act.

{% callout title="Consider this!" %}
When designing a schema, always think about how you will update it.

If you want to be able to update a single field, make sure that setting it won't cause data inconsistency.
{% /callout %}

If you **must** have the fields required, then make sure you always set them together, e.g.:

```ts
db.organizations.update(orgId, ($) => ({
  counters: {
    drafts: $.increment(0),
    scheduled: $.increment(1),
    published: $.increment(0),
  },
}))
```

## Type-safe records

```ts
import { schema } from 'typesaurus'

interface Organization {
  folders?: {
    [folderId: string]: {
      drafts: number
      scheduled: number
      published: number
    }
  }
}

const db = schema(($) => ({ organizations: $.collection<Organization>() }))
```

```ts
db.organizations.update(orgId, ($) =>
  $.field('folders', folderId, 'scheduled').set($.increment(1))
)
```

```json
{
  "folders": {
    "01eSWZkN7OSoW61jZBYswQ5Qb0y2": {
      "scheduled": 1
    }
  }
}
```
