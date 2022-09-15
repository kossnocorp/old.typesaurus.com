---
title: Designing schema
description: Desinging Firestore database schema with Typesaurus
---

## Recommended config

## `undefined` & `null`

## Typed ids

## Server dates

## Safe paths

Besides preventing runtime errors, preserving data consistency is another big focus of Typesaurus.

Of the ways data can become inconsistent is through partial updates. While checking if the whole document is set correctly is a reasonably simple task, verifying if a single field update won't cause an inconsistency is challenging.

That's why Typesaurus incorporates safe path checks on updates that prevent field updates that would get your documents into an impossible state.

To understand the problem and how safe paths work, let's take a look at an example:
