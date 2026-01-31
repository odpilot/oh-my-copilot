# Task Template System

## Overview

The Task Template System provides pre-configured workflows for common development tasks. Templates define a series of steps executed by different agents to accomplish complex goals.

## Features

- **8 Built-in Templates**: Ready-to-use templates for common tasks
- **Variable Support**: Customize templates with runtime variables
- **Step Dependencies**: Define execution order and dependencies
- **Optional Steps**: Skip steps based on conditions
- **CLI Integration**: Run templates from the command line

## Built-in Templates

### 1. Build REST API (`build-rest-api`)

Create a complete REST API with CRUD operations.

**Variables:**
- `resourceName` (required): Resource name (e.g., 'users', 'products')
- `framework` (select): Web framework (express, fastify, koa, hono)
- `database` (select): Database (memory, sqlite, postgresql, mongodb)
- `includeTests` (boolean): Generate tests (default: true)

**Steps:**
1. API Design (architect)
2. Implementation (executor)
3. Testing (qa-tester, optional)
4. Security Review (security)

### 2. Code Review (`code-review`)

Comprehensive code review with quality and security checks.

**Variables:**
- `codeLocation` (required): File path or directory to review
- `focusArea` (select): Focus area (all, security, performance, maintainability, style)

**Steps:**
1. Code Review (reviewer)
2. Security Analysis (security)

### 3. Test Generation (`test-generation`)

Generate comprehensive test suites for existing code.

**Variables:**
- `sourceFile` (required): Source file to test
- `testFramework` (select): Testing framework (vitest, jest, mocha, ava)
- `coverageTarget` (number): Target coverage percentage (default: 80)

**Steps:**
1. Code Analysis (architect)
2. Generate Tests (qa-tester)
3. Review Tests (reviewer)

### 4. Documentation (`documentation`)

Generate comprehensive documentation for code.

**Variables:**
- `projectPath` (required): Project or code path
- `docType` (select): Documentation type (api, user-guide, architecture, tutorial)
- `format` (select): Format (markdown, html, asciidoc)

**Steps:**
1. Analyze Code (architect)
2. Write Documentation (designer)
3. Review Documentation (reviewer)

### 5. Refactoring (`refactoring`)

Refactor code to improve quality and maintainability.

**Variables:**
- `targetFile` (required): File or module to refactor
- `refactoringGoal` (select): Goal (improve-readability, reduce-complexity, improve-performance, apply-design-patterns, extract-duplicates)

**Steps:**
1. Analyze Code (architect)
2. Implement Refactoring (executor)
3. Verify with Tests (qa-tester)
4. Review Refactoring (reviewer)

### 6. Bug Fix (`bug-fix`)

Systematic approach to fixing bugs.

**Variables:**
- `bugDescription` (required): Bug description
- `affectedArea` (required): Affected code area
- `severity` (select): Severity (critical, high, medium, low)

**Steps:**
1. Analyze Bug (architect)
2. Implement Fix (executor)
3. Create Tests (qa-tester)
4. Security Review (security)

### 7. Feature Implementation (`feature-implementation`)

Complete feature implementation from design to testing.

**Variables:**
- `featureName` (required): Feature name
- `featureDescription` (required): Detailed description
- `complexity` (select): Complexity (simple, medium, complex)

**Steps:**
1. Feature Design (architect)
2. UI/UX Design (designer)
3. Implementation (executor)
4. Testing (qa-tester)
5. Security Review (security)
6. Documentation (designer)

### 8. Security Audit (`security-audit`)

Comprehensive security audit of codebase.

**Variables:**
- `auditScope` (required): Scope (file/directory path)
- `auditDepth` (select): Analysis depth (quick, standard, thorough)

**Steps:**
1. Security Scan (security)
2. Vulnerability Analysis (architect)
3. Code Review (reviewer)

## CLI Usage

### List Templates

```bash
# List all templates
omc templates list

# List templates by category
omc templates list --category development
```

### Show Template Details

```bash
omc templates show build-rest-api
```

### Run a Template

```bash
# Run with required variables
omc templates run build-rest-api \
  --resourceName users \
  --framework express \
  --database sqlite

# Run code review
omc templates run code-review \
  --codeLocation ./src/api \
  --focusArea security

# Run test generation
omc templates run test-generation \
  --sourceFile ./src/utils.ts \
  --testFramework vitest \
  --coverageTarget 90
```

### Interactive Mode

```bash
# Interactive mode (prompts for variables)
omc templates run build-rest-api -i
```

## Programmatic Usage

### Load and Execute Templates

```typescript
import { TemplateLoader } from 'oh-my-copilot';

const loader = new TemplateLoader();

// List templates
const templates = loader.listTemplates();
console.log('Available templates:', templates.map(t => t.id));

// Get template details
const template = loader.getTemplate('build-rest-api');
console.log('Template:', template.name);
console.log('Variables:', template.variables);

// Execute template
const result = await loader.executeTemplate('build-rest-api', {
  resourceName: 'users',
  framework: 'express',
  database: 'sqlite',
  includeTests: true
});

if (result.success) {
  console.log('Template executed successfully!');
  console.log('Steps:', result.steps.length);
  console.log('Total time:', result.totalTime, 'ms');
} else {
  console.error('Template failed:', result.error);
}
```

### Load Custom Templates

```typescript
// Load template from file
const customTemplate = await loader.loadFromFile('./my-template.json');

// Load templates from directory
const templates = await loader.loadFromDirectory('./templates');

// Execute custom template
const result = await loader.executeTemplate('my-template', {
  // variables...
});
```

## Creating Custom Templates

Create a JSON file with the template definition:

```json
{
  "id": "my-custom-template",
  "name": "My Custom Template",
  "description": "Description of what this template does",
  "category": "development",
  "variables": [
    {
      "name": "targetFile",
      "description": "File to process",
      "type": "string",
      "required": true
    },
    {
      "name": "option",
      "description": "Processing option",
      "type": "select",
      "required": false,
      "default": "default",
      "options": ["default", "advanced", "quick"]
    }
  ],
  "agents": [],
  "steps": [
    {
      "id": "analyze",
      "name": "Analyze",
      "agent": "architect",
      "prompt": "Analyze {{targetFile}} with option {{option}}"
    },
    {
      "id": "process",
      "name": "Process",
      "agent": "executor",
      "prompt": "Process {{targetFile}} based on the analysis",
      "dependsOn": ["analyze"]
    }
  ]
}
```

### Template Structure

- **id**: Unique template identifier
- **name**: Human-readable name
- **description**: Template description
- **category**: Category (development, testing, review, devops, documentation)
- **variables**: Array of variable definitions
- **agents**: Agent configurations (optional)
- **steps**: Array of execution steps

### Variable Types

- `string`: Text input
- `number`: Numeric input
- `boolean`: True/false
- `select`: Dropdown selection (requires `options` array)

### Step Dependencies

```json
{
  "id": "step2",
  "name": "Step 2",
  "agent": "executor",
  "prompt": "Do something",
  "dependsOn": ["step1"]  // Waits for step1 to complete
}
```

### Optional Steps

```json
{
  "id": "optional-step",
  "name": "Optional Step",
  "agent": "qa-tester",
  "prompt": "Run tests",
  "optional": true  // Can be skipped
}
```

Or with conditional logic:

```json
{
  "id": "test-step",
  "name": "Testing",
  "agent": "qa-tester",
  "prompt": "Run tests",
  "optional": "{{!includeTests}}"  // Skip if includeTests is false
}
```

## Best Practices

1. **Variable Naming**: Use camelCase for variable names
2. **Descriptions**: Provide clear, helpful variable descriptions
3. **Defaults**: Set sensible defaults for optional variables
4. **Dependencies**: Minimize step dependencies for parallel execution
5. **Prompts**: Write clear, specific prompts with variable placeholders
6. **Error Handling**: Templates stop on first failure

## Examples

See [examples/templates/](../examples/templates/) for complete examples:

- `examples/templates/custom-template.json` - Custom template example
- `examples/templates/run-template.ts` - Programmatic template execution
