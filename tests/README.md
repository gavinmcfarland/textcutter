# Tests

1. Open the Figma desktop app
2. Open a blank Figma file
3. Make sure the plugin is open
4. To run tests first start the dev server with support for testing (`pnpm dev -ws -m test`):

    ```bash
    pnpm dev:test
    ```

5. Then run the test using Vitest (`npx vitest run`):

    ```bash
    pnpm test
    ```

6. You can also run the test with the UI:

    ```bash
    pnpm test:ui
    ```

## Gotchas

### Plugma bugs

Plugma is still in beta and has some bugs.

1. When you want to create more than one test file you need to run each test file individually. Hopefully this will be resolved in the next release.

    ```bash
    npx vitest --run tests/split-text.test.ts
    ```

2. If you create new tests or change the name of a test you need to restart the dev server.
3. Sometimes the test might hang when watching tests.
