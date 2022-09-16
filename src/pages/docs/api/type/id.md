---
title: Id
description: Id type reference
---

{% callout type="warning" title="You might want to use inferred type instead!" %}
Unless you use the type when defining the database, [consider using inferred id types](/docs/guides/type-safety#schema-types). It's a more idiomatic and less verbose way to define the ids.
{% /callout %}

The `Id` type allows to define typed id string:

```ts
import { schema, Typesaurus } from 'typesaurus'

const db = schema(($) => {
  organizations: $.collection<Organization>(),
  subscriptions: $.collection<Subscription, Typesaurus.Id<'organizations'>>()
})
```

[Learn more about typed ids](/docs/guides/type-safety#typed-ids).
