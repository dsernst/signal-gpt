# signal-gpt

Signal Bot to interact with ChatGPT.

## How it works:

1. [signal-http](https://github.com/dsernst/signal-http/) listens for new messages, forwarding them over here.
2. [`index.ts`](./index.ts) hears there's a new message, and checks if it matches any of the known commands (registered by creating a file in `commands/` dir)
3. [`commands/gpt.ts`](./commands/gpt.ts) is the most interesting one. It passes the query to the ChatGPT API, then forwards the response back to [signal-http](https://github.com/dsernst/signal-http/) as a reply.

## Running yourself

1. Fork and clone down this repository.
2. Install dependencies: `yarn`
3. Fill out your own `.env` file (see the `.env.example` in [signal-http](https://github.com/dsernst/signal-http/) repo)
4. Start the bot up with `yarn dev`
