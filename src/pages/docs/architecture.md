---
title: Philosophy & architecture
description: Typesaurus philosophy and architecture
---

This document describes the principles used while designing Typesaurus, which will help you understand the reasoning behind limitations and use those to your advantage. {% .lead %}

## Main focus

Typesaurus focuses on preventing bugs by providing complete type-safety on writing and reading from Firestore.

Type-safe writing allows to preserve data consistency with the described schema, which removes one of the most significant disadvantages of any document-based database while keeping the ease of use.

Type-safe reading prevents client-side bugs by providing accurate information about the possible document shape.

## Developer experience

Focus on type-safety often worsens developer experience in one way while making it better in another. So another main focus of Typeusaurus is ensuring these compromises are well compensated.

If we can simplify something without compromising typings, we must do it.

The key values of the developer experience are (in order):

- Safety guards: the type system must prevent developers from making mistakes.
- Error clarify: the errors must guide developers when possible or well documented if not.
- Simplicity: resulting code should be as simple as possible.

## TypeScript-first

The TypeScript type system specificity shapes Typesaurus API providing the best possible experience for TypeScript developers.

If there is a choice between providing better types or making API easier to use, the types always will be the pick.
