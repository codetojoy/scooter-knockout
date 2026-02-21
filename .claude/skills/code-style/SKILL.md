---
name: code-style
description: my personal coding preferences
---

# General Formatting

- generally indent with 4 spaces and NO hard tabs
- all console output should be prefixed with `TRACER `, so that it stands out against system-generated logs
- generally have braces on the same line such as:
```
while (!done) {
    if (a && b) {
        doSomething();
    }
}
```

## Type Philosophy

- in Javascript, prefer `const` and `let` over `var`, and use `const` when possible

## General Comments

- any guard clause should have a comment `// guard`
- in unit tests, instead reduce "arrange / act / assert" to just "test" for "act"
    - that is, instead of this pattern:
```
public void testFoobar_HappyPath() {
    // arrange
    EmployeeService employeeService = new EmployeeService();

    // act
    boolean result = employeeService.foobar();

    // assert
    assertTrue(result);
}
```
    - use this pattern:
```
public void testFoobar_HappyPath() {
    EmployeeService employeeService = new EmployeeService();

    // test
    boolean result = employeeService.foobar();

    assertTrue(result);
}
```

