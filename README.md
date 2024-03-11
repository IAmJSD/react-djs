<h1 align="center">react-djs</h1>

A discord.js renderer for React. This forks a lot of content from another React library called [Reacord](https://github.com/itsMapleLeaf/reacord), but has the following advantages:

- It is much closer coupled to discord.js. This is better because you can get the message object and await the message reply so you know it got delivered.
- It is a significantly smaller codebase with less abstractions in general. The 3 main abstractions in the codebase are the render manager, the message renderer, and the React renderer (takes the React content and passes it to the message renderer).
- It doesn't break with ephemeral messages. I tried to fix this in Reacord, but found the codebase hard to navigate around.
- It automatically garbage collects!

## Usage

To use react-djs, you first want to create a `RenderManager` with the client. You only want to do this once per instance:

```js
export const renderManager = new RenderManager(client);
```

From here, we can use either use create:
```js
const message = await renderManager.create(channel, <MyAwesomeComponent name="Jeff" />);
```

Or we can use reply:
```js
// For messages:
const message = await renderManager.reply(msg, <MyAwesomeComponent />);

// For interactions:
const message = await renderManager.reply(interaction, <MyAwesomeComponent />);

// For interactions (ephemeral):
const message = await renderManager.reply(interaction, <MyAwesomeComponent />, { ephemeral: true });
```

You can then use the components within the library to build your application!
