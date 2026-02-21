
### Running Tests

#### Jasmine unit tests (browser-based)

Jasmine tests run in the browser via a standalone HTML runner. No extra install step is needed beyond having the app's Python server running.

```bash
./run.sh   # starts HTTP server on port 8080
# then open http://localhost:8080/tests/jasmine/SpecRunner.html
```

Results are displayed directly in the browser. Covers `utils.js`, `AttendeeList.js`, and `storage.js`.

#### Playwright UI tests (headless)

Playwright requires Node.js. On first use, install dependencies and the browser binary:

```bash
npm install
npx playwright install chromium
```

Then run the tests (the Python HTTP server is started automatically):

```bash
npx playwright test
# or via the npm script:
npm run test:playwright
```

Test results are printed to the terminal. An HTML report is written to `playwright-report/`.
