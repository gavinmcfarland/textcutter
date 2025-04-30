# Tests

1. Open the Figma desktop app

2. Open a blank Figma file

3. To run tests first start the dev server with WebSockets enabled:

    ```bash
    npm run dev -- --ws
    ```

4. Then run vitest:

    ```bash
    npx vitest
    ```

## Gotchas

### Plugma bugs

Plugma is still in beta and has some bugs.

1. When you run a test you need to run each test individually.

```bash
npx vitest --run tests/split-text.test.ts
```

2. If you create new tests or change the name of a test you need to restart the dev server.
