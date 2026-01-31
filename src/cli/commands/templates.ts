/**
 * Templates CLI Command
 */

import { TemplateLoader } from '../../templates/template-loader.js';
import { ui } from '../ui.js';
import chalk from 'chalk';

interface TemplatesCommandOptions {
  action: 'list' | 'show' | 'run';
  templateId?: string;
  variables?: Record<string, any>;
  interactive?: boolean;
}

export async function templatesCommand(action: string, templateId?: string, options?: any) {
  const loader = new TemplateLoader();

  switch (action) {
    case 'list':
      await listTemplates(loader, options);
      break;

    case 'show':
      if (!templateId) {
        ui.error('Template ID required for show command');
        process.exit(1);
      }
      await showTemplate(loader, templateId);
      break;

    case 'run':
      if (!templateId) {
        ui.error('Template ID required for run command');
        process.exit(1);
      }
      await runTemplate(loader, templateId, options);
      break;

    default:
      ui.error(`Unknown action: ${action}`);
      ui.info('Available actions: list, show, run');
      process.exit(1);
  }
}

async function listTemplates(loader: TemplateLoader, options: any) {
  ui.header('📋 Available Templates');

  const templates = loader.listTemplates(options?.category);

  if (templates.length === 0) {
    ui.info('No templates found');
    return;
  }

  // Group by category
  const byCategory: Record<string, typeof templates> = {};
  for (const template of templates) {
    if (!byCategory[template.category]) {
      byCategory[template.category] = [];
    }
    byCategory[template.category].push(template);
  }

  for (const [category, categoryTemplates] of Object.entries(byCategory)) {
    console.log(chalk.bold.cyan(`\n${category.toUpperCase()}`));
    for (const template of categoryTemplates) {
      console.log(chalk.white(`  ${template.id.padEnd(25)} - ${template.name}`));
      console.log(chalk.gray(`    ${template.description}`));
    }
  }

  console.log(chalk.gray(`\nTotal: ${templates.length} templates`));
}

async function showTemplate(loader: TemplateLoader, templateId: string) {
  const template = loader.getTemplate(templateId);

  if (!template) {
    ui.error(`Template not found: ${templateId}`);
    process.exit(1);
  }

  ui.header(`📋 Template: ${template.name}`);

  console.log(chalk.bold('ID:'), template.id);
  console.log(chalk.bold('Description:'), template.description);
  console.log(chalk.bold('Category:'), template.category);

  if (template.variables.length > 0) {
    console.log(chalk.bold.cyan('\nVariables:'));
    for (const variable of template.variables) {
      const required = variable.required ? chalk.red('*required') : chalk.gray('optional');
      const defaultValue = variable.default !== undefined ? chalk.gray(` (default: ${variable.default})`) : '';
      console.log(`  ${chalk.white(variable.name)} ${required}${defaultValue}`);
      console.log(chalk.gray(`    ${variable.description}`));
      if (variable.options) {
        console.log(chalk.gray(`    Options: ${variable.options.join(', ')}`));
      }
    }
  }

  console.log(chalk.bold.cyan('\nSteps:'));
  for (const step of template.steps) {
    const optional = step.optional ? chalk.gray(' (optional)') : '';
    const deps = step.dependsOn ? chalk.gray(` [depends on: ${step.dependsOn.join(', ')}]`) : '';
    console.log(`  ${chalk.white(step.id)}: ${step.name}${optional}${deps}`);
    console.log(chalk.gray(`    Agent: ${step.agent}`));
  }
}

async function runTemplate(loader: TemplateLoader, templateId: string, options: any) {
  const template = loader.getTemplate(templateId);

  if (!template) {
    ui.error(`Template not found: ${templateId}`);
    process.exit(1);
  }

  ui.header(`🚀 Running Template: ${template.name}`);

  // Collect variables
  const variables: Record<string, any> = { ...options };

  // TODO: Interactive mode to collect variables
  if (options.interactive) {
    ui.info('Interactive mode not yet implemented');
    ui.info('Please provide variables via command line options');
    process.exit(1);
  }

  // Validate required variables
  for (const variable of template.variables) {
    if (variable.required && !(variable.name in variables) && variable.default === undefined) {
      ui.error(`Required variable missing: ${variable.name}`);
      ui.info(`Use --${variable.name} <value> to provide it`);
      process.exit(1);
    }
  }

  try {
    ui.startSpinner('Executing template...');

    const result = await loader.executeTemplate(templateId, variables);

    if (result.success) {
      ui.succeedSpinner('Template executed successfully!');

      console.log(chalk.bold.green('\n✓ Success'));
      console.log(chalk.gray(`Total time: ${result.totalTime}ms`));

      console.log(chalk.bold.cyan('\nStep Results:'));
      for (const step of result.steps) {
        const status = step.success ? chalk.green('✓') : chalk.red('✗');
        console.log(`${status} ${step.stepName} (${step.executionTime}ms)`);
        if (step.output) {
          console.log(chalk.gray(step.output.substring(0, 200) + '...'));
        }
      }
    } else {
      ui.failSpinner('Template execution failed');

      console.log(chalk.bold.red('\n✗ Failed'));
      console.log(chalk.red(`Error: ${result.error}`));

      if (result.steps.length > 0) {
        console.log(chalk.bold.cyan('\nCompleted Steps:'));
        for (const step of result.steps) {
          const status = step.success ? chalk.green('✓') : chalk.red('✗');
          console.log(`${status} ${step.stepName}`);
        }
      }

      process.exit(1);
    }
  } catch (error) {
    ui.failSpinner('An error occurred');
    ui.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
