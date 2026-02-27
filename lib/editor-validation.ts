import Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import {
  ValidationSeverity,
  type ValidationError,
  type Validator,
} from 'vanilla-jsoneditor';

type EditorPath = string[];

function decodeJsonPointerToken(token: string): string {
  return token.replace(/~1/g, '/').replace(/~0/g, '~');
}

function pointerToPath(pointer: string): EditorPath {
  if (!pointer || pointer === '/') return [];

  return pointer
    .split('/')
    .slice(1)
    .map(decodeJsonPointerToken);
}

function toValidationError(error: ErrorObject): ValidationError {
  const path = pointerToPath(error.instancePath ?? '');
  const message = error.message
    ? `${error.instancePath || '/'} ${error.message}`.trim()
    : 'Schema validation error';

  return {
    path,
    message,
    severity: ValidationSeverity.error,
  };
}

export function createSchemaValidator(schema: Record<string, unknown>): Validator {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    allowUnionTypes: true,
  });

  const validate = ajv.compile(schema);

  return (json: unknown) => {
    const valid = validate(json);
    if (valid || !validate.errors) {
      return [];
    }

    return validate.errors.map(toValidationError);
  };
}

export function createNoopValidator(): Validator {
  return () => [];
}

export function getJsonSyntaxPosition(errorMessage: string): number | null {
  const match = errorMessage.match(/position\s+(\d+)/i);
  if (!match) return null;
  return Number.parseInt(match[1], 10);
}
