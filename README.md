## CDK Content Projection Directives

This prototype defines several directives that work together to implement custom content projection.

### `*cdkSlot`

Structural directive that declares a slot into which content can be projected. We can think of this as roughly a replacement for `<ng-content>`. Rather than a CSS selector, these slots have a name which is specified using the sturctural directive's expression: `<ng-template cdkSlot="user-content" />`.

The structural directive's template contains the default content to use if the user does not provide any content for this slot: `<p *cdkSlot="'user-content'">Default content!</p>`

Note: components that use `*cdkSlot` in their template need to either add `CdkAcceptsProjectedContent` as a host directive, or otherwise provide a `CdkProjectionManager`.

### `*cdkProject`

Structural directive that provides a template to be projected into a particular named slot. This should be passed as content to a component that uses `*cdkSlot`. The structural directive expression should be the name of the slot to project into. We can think of this as roughly a replacement for `ngProjectAs`.

```html
<some-cdk-slot-comp>
  <p *cdkProject="'user-content'">User provided content!</p>
</some-cdk-slot-comp>
```

### `cdkExposeSlots`

Directive that allows passing content through to a child component. By default, a component's `*cdkProject` content is not passed through to child component's in its template. However, we can put this directive on the child component to allow passing content through to it. The directive expression is a list of slots to expose. Similar to host directive inputs/outputs we can use special strings of the form: `parent-slot-name:child-slot-name` to rename slots when we expose them through the parent.

```html
<div class="header">
  <some-cdk-slot-comp [cdkExposeSlots]="['header-user-content:user-content']" />
</div>
<div class="body">
  <some-cdk-slot-comp [cdkExposeSlots]="['user-content']" />
</div>
```

## Building a text field

### Angular Material perspective

As an example, lets say we're creating a text field component for Angular Material. We want it to work like the mat-form-field, except we'll use the projection directives above for this one. We'll create 2 components: `<mat-text-field>` (for the container with floating label, error message, etc.) and `<input matInput>` (to interface with the native input). The `matInput` doesn't need to use any content projection, but the `<mat-text-field>` has a few content projected pieces so lets look at its template:

https://github.com/mmalerba/projection/blob/9bb73906c00a502fe535fc4393461d72ac53de4d/src/mat/text-field.html#L1-L12

We see three `cdkSlot` here representing the different parts user content can be projected into:

- The `label` slot with an empty template, if the user doesn't give us some label content, we'll render nothing.
- The `input` slot with a `matInput` as its template, if the user doesn't give us a template we'll stamp out this one.
- The `error` slot with a simple text node as its template, representing the default error message

### Pantheon Common Components perspective

Great, we've built our Angular Material text field. Now lets switch gears and pretned we're on the Pantheon common components team. We want to create wrappers for all of the Angular Material components. That way we can bundle in the features we need, put on extra guard rails, and ensure a consistent experience across all Pantheon. We'll call our wrapper `<app-text-field>`. Let's take a look at its template:

https://github.com/mmalerba/projection/blob/9bb73906c00a502fe535fc4393461d72ac53de4d/src/app/text-field.html#L1-L4

We're using the `<mat-text-field>`, but we're projecting in our own custom label and error using `cdkProject`. We don't want users stuffing random images, etc. into the label, so we restrict it to just text passed via an `input()`. We also think the default error message from Angular Material is kinda vague, so we'll provide our own default error.

We still want our users to pass in a `matInput`, so we'll expose that using `cdkExposeSlots`. We'll also expose the error slot so that users can still provide a custom error if they don't want to use our improved default.

### Pantheon App perspective

With the Pantheon wrapper built, we can now switch to the perspective of an app developer on Pantheon. We just want to build a simple form for the user to input their name and address. The address field is the simplest since its optional and we don't need any validation, so lets look at that first.

https://github.com/mmalerba/projection/blob/9bb73906c00a502fe535fc4393461d72ac53de4d/src/app/home.html#L22

That was easy! We don't need to project anything, we can just use the default input from Angular Material and the default label the Pantheon component generates from the label input.

Next up, for the first name we want to add some validation and placeholder to the input, so this time we can't rely on the default input template, we'll provide our own:

https://github.com/mmalerba/projection/blob/9bb73906c00a502fe535fc4393461d72ac53de4d/src/app/home.html#L1-L8

And finally for the last name, we want to have a special error message that links to some help docs with an explanation of why we require your last name. We can provide our own custom error message for this one.

https://github.com/mmalerba/projection/blob/9bb73906c00a502fe535fc4393461d72ac53de4d/src/app/home.html#L10-L20

This is really cool! A large number of Angular Material Github issues boil down to "Why can't I wrap Angular Material components and then deeply project content into them through my wrapper?" In addition to that, having fallback content makes it so the user doesn't have to project in the whole world just for the most basic use case.

## Challenges / drawbacks

### Clunky API

Parts of the API feel a bit clunky.

- The double quotes around slot names passed to `*cdkSlot`/`*cdkProject`
- Empty default template is verbose
- Need host directive or provider for any component that uses `*cdkSlot`

### Lots of directives instantiated

Wind up needing to create a bunch of directive instances for all of the slots and projected contents, may not be the most efficient

### Can't rely on `viewChildren` / `contentChildren`

You can't rely on `viewChildren` or `contentChildren` to look at the projected content. `viewChildren` can find the slot's default template, and `contentChildren` can find content passed in from the direct parent, but content that was passed in from an ancestor via `cdkExposeSlots` doesn't show up in either. This means the only real way to coordinate between the parent (e.g. `<mat-text-field>`) and child (e.g. `matInput`) is for the child to inject the parent:

https://github.com/mmalerba/projection/blob/9bb73906c00a502fe535fc4393461d72ac53de4d/src/mat/input.ts#L30

and notify the parent of the child's existence:

https://github.com/mmalerba/projection/blob/9bb73906c00a502fe535fc4393461d72ac53de4d/src/mat/input.ts#L36-L38

This is unfortunate, because we don't want the child to necissarily know about all the parent components it might be projected into.

### Easier for user to project wrong content

When using normal content projection, the selector helps ensure the user passes the correct type of content (e.g. an `<input>` element, or a particular component). A user could still do the wrong thing if they wanted `<button ngProjectAs="input">`, but they have to go our of their way to do it. Since this style relies on named slots rather than selector slots, it makes it easier to just pass whatever content you want.
