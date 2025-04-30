Fix bug: process.env.NODE_ENV is not set to test

# Tests

1. Open the Figma desktop app

2. For the time being you need to include a dummy ui in the `manifest.json` file and prevent the plugin from closing.

3. Open a blank Figma file

4. To run tests first start the dev server with WebSockets enabled and the mode set to test:

    ```bash
    npm run dev -- -ws -m test
    ```

5. Then run vitest:

    ```bash
    npx vitest
    ```

## Gotchas

### Plugma bugs

Plugma is still in beta and has some bugs.

1. When you want to create more than one test file you need to run each test file individually. Hopefully this will be resolved in the next release.

```bash
npx vitest --run tests/split-text.test.ts
```

2. If you create new tests or change the name of a test you need to restart the dev server.
