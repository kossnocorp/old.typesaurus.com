---
title: id
description: id method reference
---

The `id` method allows generating a random id or cast `string` to the collection id type.

[Learn more about typed ids](/docs/guides/type-safety#typed-ids).

## Generating id

When called without arguments, the function generates a random document id using Firebase and returns `Promise<string>`.

```ts
const newCommentId = await db.comments.id()
```

{% callout title="Why id is async?" %}
You might have noticed that when generating an id, the method returns a promise.

Like any other method that depends on the Firebase SDKs, it returns a promise so that the Web SDK package can be loaded asynchronously, save a few kilobytes, and reduce time to (LCP)[https://web.dev/lcp/].
{% /callout %}

[Learn more about subcollections](/docs/guides/type-safety#subcollections).

## Casting `string`

If you somehow get untyped id string, you can cast it using the id function:

```ts
const commentId = db.comments.id('t2nNOgoQY8a5vcvWl1yAz26Ue7k2')
```

## Subcollections

Typically you access the `id` method on a collection, but in the case with subcollections, it's inconvenient to create it first to get an id, that's why Typesaurus generates a shortcut API:

```ts
// 👎 too verbose, need to use random id:
const badCommentId = await db
  .posts(db.posts.id('does not matter'))
  .comments.id()

// 👍 short and sweet:
const newCommentId = await db.posts.sub.comments.id()

// You can also cast:
const commentId = db.posts.sub.comments.id('t2nNOgoQY8a5vcvWl1yAz26Ue7k2')
```
