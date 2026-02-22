/**
 * Infer a schema from JSON and emit class/type definitions for various languages.
 * Used by JSON-to-TypeScript, JSON-to-Python, etc.
 */

export type JsonSchema =
  | { type: 'string' }
  | { type: 'number' }
  | { type: 'boolean' }
  | { type: 'null' }
  | { type: 'array'; item: JsonSchema }
  | { type: 'object'; fields: Record<string, JsonSchema> };

function inferSchema(value: unknown): JsonSchema {
  if (value === null) return { type: 'null' };
  if (typeof value === 'string') return { type: 'string' };
  if (typeof value === 'number') return { type: 'number' };
  if (typeof value === 'boolean') return { type: 'boolean' };
  if (Array.isArray(value)) {
    const item = value.length > 0 ? inferSchema(value[0]) : { type: 'null' as const };
    return { type: 'array', item };
  }
  if (typeof value === 'object') {
    const fields: Record<string, JsonSchema> = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = inferSchema(v);
    }
    return { type: 'object', fields };
  }
  return { type: 'null' };
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^(\d)/, '_$1') || 'field';
}

function pascalCase(name: string): string {
  const s = safeName(name);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function jsonToTypeScript(input: string): string {
  const obj = JSON.parse(input);
  const schema = inferSchema(obj);
  if (schema.type !== 'object') return '// Root must be an object\ninterface Root { }\n';

  function tsType(s: JsonSchema, name: string): string {
    switch (s.type) {
      case 'string': return 'string';
      case 'number': return 'number';
      case 'boolean': return 'boolean';
      case 'null': return 'null';
      case 'array': return `${tsType(s.item, name)}[]`;
      case 'object':
        const inner = Object.entries(s.fields)
          .map(([k, v]) => `  ${safeName(k)}: ${tsType(v, pascalCase(k))};`)
          .join('\n');
        return `{\n${inner}\n}`;
    }
  }

  const lines = Object.entries(schema.fields).map(([k, v]) => {
    const t = tsType(v, pascalCase(k));
    return `  ${safeName(k)}: ${t};`;
  });
  return `interface Root {\n${lines.join('\n')}\n}\n`;
}

export function jsonToPython(input: string): string {
  const obj = JSON.parse(input);
  const schema = inferSchema(obj);
  if (schema.type !== 'object') return '# Root must be an object\nfrom typing import Any\n\nclass Root:\n    pass\n';

  function pyType(s: JsonSchema): string {
    switch (s.type) {
      case 'string': return 'str';
      case 'number': return 'float';
      case 'boolean': return 'bool';
      case 'null': return 'None';
      case 'array': return `list[${pyType(s.item)}]`;
      case 'object': return 'dict[str, Any]';
    }
  }

  const lines = Object.entries(schema.fields).map(([k, v]) => {
    const name = safeName(k);
    const t = pyType(v);
    return `    ${name}: ${t}`;
  });
  return `from typing import Any\n\nclass Root:\n${lines.join('\n')}\n`;
}

export function jsonToJava(input: string): string {
  const obj = JSON.parse(input);
  const schema = inferSchema(obj);
  if (schema.type !== 'object') return "// Root must be an object\npublic class Root {\n}\n";

  function javaType(s: JsonSchema): string {
    switch (s.type) {
      case 'string': return 'String';
      case 'number': return 'Double';
      case 'boolean': return 'Boolean';
      case 'null': return 'Object';
      case 'array': return `List<${javaType(s.item)}>`;
      case 'object': return 'Map<String, Object>';
    }
  }

  const lines = Object.entries(schema.fields).map(([k, v]) => {
    const name = safeName(k);
    const t = javaType(v);
    return `    private ${t} ${name};`;
  });
  return `import java.util.List;\nimport java.util.Map;\n\npublic class Root {\n${lines.join('\n')}\n}\n`;
}

export function jsonToGo(input: string): string {
  const obj = JSON.parse(input);
  const schema = inferSchema(obj);
  if (schema.type !== 'object') return "// Root must be an object\ntype Root struct {}\n";

  function goType(s: JsonSchema): string {
    switch (s.type) {
      case 'string': return 'string';
      case 'number': return 'float64';
      case 'boolean': return 'bool';
      case 'null': return 'interface{}';
      case 'array': return `[]${goType(s.item)}`;
      case 'object': return 'map[string]interface{}';
    }
  }

  const lines = Object.entries(schema.fields).map(([k, v]) => {
    const name = pascalCase(k);
    const t = goType(v);
    return `\t${name} ${t} \`json:"${k}"\``;
  });
  return `type Root struct {\n${lines.join('\n')}\n}\n`;
}

export function jsonToCsharp(input: string): string {
  const obj = JSON.parse(input);
  const schema = inferSchema(obj);
  if (schema.type !== 'object') return "// Root must be an object\npublic class Root { }\n";

  function csType(s: JsonSchema): string {
    switch (s.type) {
      case 'string': return 'string';
      case 'number': return 'double';
      case 'boolean': return 'bool';
      case 'null': return 'object?';
      case 'array': return `List<${csType(s.item)}>`;
      case 'object': return 'Dictionary<string, object>';
    }
  }

  const lines = Object.entries(schema.fields).map(([k, v]) => {
    const name = pascalCase(safeName(k));
    const t = csType(v);
    return `    public ${t} ${name} { get; set; }`;
  });
  return `using System.Collections.Generic;\n\npublic class Root\n{\n${lines.join('\n')}\n}\n`;
}

export function jsonToDart(input: string): string {
  const obj = JSON.parse(input);
  const schema = inferSchema(obj);
  if (schema.type !== 'object') return '// Root must be an object\nclass Root {}\n';

  function dartType(s: JsonSchema): string {
    switch (s.type) {
      case 'string': return 'String';
      case 'number': return 'num';
      case 'boolean': return 'bool';
      case 'null': return 'dynamic';
      case 'array': return `List<${dartType(s.item)}>`;
      case 'object': return 'Map<String, dynamic>';
    }
  }

  const lines = Object.entries(schema.fields).map(([k, v]) => {
    const name = safeName(k);
    const t = dartType(v);
    return `  final ${t} ${name};`;
  });
  return `class Root {\n${lines.join('\n')}\n  Root({${Object.keys(schema.fields).map((k) => safeName(k)).join(', ')});\n}\n`;
}

export function jsonToRust(input: string): string {
  const obj = JSON.parse(input);
  const schema = inferSchema(obj);
  if (schema.type !== 'object') return "// Root must be an object\npub struct Root {}\n";

  function rustType(s: JsonSchema): string {
    switch (s.type) {
      case 'string': return 'String';
      case 'number': return 'f64';
      case 'boolean': return 'bool';
      case 'null': return 'Option<serde_json::Value>';
      case 'array': return `Vec<${rustType(s.item)}>`;
      case 'object': return 'serde_json::Map<String, serde_json::Value>';
    }
  }

  const lines = Object.entries(schema.fields).map(([k, v]) => {
    const name = safeName(k);
    const t = rustType(v);
    return `    pub ${name}: ${t},`;
  });
  return `use serde::{Deserialize, Serialize};\n\n#[derive(Debug, Serialize, Deserialize)]\npub struct Root {\n${lines.join('\n')}\n}\n`;
}

export function jsonToKotlin(input: string): string {
  const obj = JSON.parse(input);
  const schema = inferSchema(obj);
  if (schema.type !== 'object') return "// Root must be an object\ndata class Root(\n)\n";

  function ktType(s: JsonSchema): string {
    switch (s.type) {
      case 'string': return 'String';
      case 'number': return 'Double';
      case 'boolean': return 'Boolean';
      case 'null': return 'Any?';
      case 'array': return `List<${ktType(s.item)}>`;
      case 'object': return 'Map<String, Any>';
    }
  }

  const lines = Object.entries(schema.fields).map(([k, v]) => {
    const name = safeName(k);
    const t = ktType(v);
    return `    val ${name}: ${t}`;
  });
  return `data class Root(\n${lines.join(',\n')}\n)\n`;
}

export function jsonToSwift(input: string): string {
  const obj = JSON.parse(input);
  const schema = inferSchema(obj);
  if (schema.type !== 'object') return "// Root must be an object\nstruct Root {}\n";

  function swiftType(s: JsonSchema): string {
    switch (s.type) {
      case 'string': return 'String';
      case 'number': return 'Double';
      case 'boolean': return 'Bool';
      case 'null': return 'Any?';
      case 'array': return `[${swiftType(s.item)}]`;
      case 'object': return '[String: Any]';
    }
  }

  const lines = Object.entries(schema.fields).map(([k, v]) => {
    const name = pascalCase(safeName(k));
    const t = swiftType(v);
    return `    let ${name}: ${t}`;
  });
  return `struct Root: Codable {\n${lines.join('\n')}\n}\n`;
}

export function jsonToPhp(input: string): string {
  const obj = JSON.parse(input);
  const schema = inferSchema(obj);
  if (schema.type !== 'object') return "<?php\n// Root must be an object\nclass Root {}\n";

  function phpType(s: JsonSchema): string {
    switch (s.type) {
      case 'string': return 'string';
      case 'number': return 'float';
      case 'boolean': return 'bool';
      case 'null': return 'mixed';
      case 'array': return 'array';
      case 'object': return 'array';
    }
  }

  const lines = Object.entries(schema.fields).map(([k, v]) => {
    const name = '$' + safeName(k);
    const t = phpType(v);
    return `    public ${t} ${name};`;
  });
  return `<?php\n\nclass Root\n{\n${lines.join('\n')}\n}\n`;
}
