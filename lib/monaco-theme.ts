export type WorkspaceTheme = 'light' | 'dark' | 'black';

interface MonacoLike {
  editor: {
    defineTheme: (
      name: string,
      theme: {
        base: 'vs' | 'vs-dark';
        inherit: boolean;
        rules: unknown[];
        colors: Record<string, string>;
      }
    ) => void;
  };
}

export function defineWorkspaceMonacoThemes(monaco: unknown) {
  const m = monaco as MonacoLike;

  m.editor.defineTheme('dt-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'editor.lineHighlightBackground': '#f1f3f6',
      'editorCursor.foreground': '#1c1c1e',
      'editor.selectionBackground': 'rgba(120, 120, 128, 0.18)',
      'editorWidget.background': '#ffffff',
      'editorWidget.border': 'rgba(0,0,0,0.08)',
    },
  });

  m.editor.defineTheme('dt-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#151821',
      'editor.lineHighlightBackground': '#1b1f2a',
      'editorCursor.foreground': '#e6e6e6',
      'editor.selectionBackground': 'rgba(154, 154, 163, 0.22)',
      'editorWidget.background': '#151821',
      'editorWidget.border': 'rgba(255,255,255,0.08)',
    },
  });

  m.editor.defineTheme('dt-black', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#111113',
      'editor.lineHighlightBackground': '#161618',
      'editorCursor.foreground': '#e6e6e6',
      'editor.selectionBackground': 'rgba(154, 154, 163, 0.2)',
      'editorWidget.background': '#111113',
      'editorWidget.border': 'rgba(255,255,255,0.08)',
    },
  });

  m.editor.defineTheme('dt-diff-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'diffEditor.insertedLineBackground': 'rgba(84, 158, 112, 0.08)',
      'diffEditor.removedLineBackground': 'rgba(178, 112, 112, 0.08)',
      'diffEditor.insertedTextBackground': 'rgba(84, 158, 112, 0.16)',
      'diffEditor.removedTextBackground': 'rgba(178, 112, 112, 0.16)',
      'diffEditor.diagonalFill': 'rgba(0,0,0,0.04)',
    },
  });

  m.editor.defineTheme('dt-diff-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#151821',
      'diffEditor.insertedLineBackground': 'rgba(84, 158, 112, 0.09)',
      'diffEditor.removedLineBackground': 'rgba(178, 112, 112, 0.09)',
      'diffEditor.insertedTextBackground': 'rgba(84, 158, 112, 0.17)',
      'diffEditor.removedTextBackground': 'rgba(178, 112, 112, 0.17)',
      'diffEditor.diagonalFill': 'rgba(255,255,255,0.03)',
    },
  });

  m.editor.defineTheme('dt-diff-black', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#111113',
      'diffEditor.insertedLineBackground': 'rgba(84, 158, 112, 0.08)',
      'diffEditor.removedLineBackground': 'rgba(178, 112, 112, 0.08)',
      'diffEditor.insertedTextBackground': 'rgba(84, 158, 112, 0.15)',
      'diffEditor.removedTextBackground': 'rgba(178, 112, 112, 0.15)',
      'diffEditor.diagonalFill': 'rgba(255,255,255,0.025)',
    },
  });
}

export function getMonacoTheme(theme: WorkspaceTheme) {
  if (theme === 'light') return 'dt-light';
  if (theme === 'black') return 'dt-black';
  return 'dt-dark';
}

export function getMonacoDiffTheme(theme: WorkspaceTheme) {
  if (theme === 'light') return 'dt-diff-light';
  if (theme === 'black') return 'dt-diff-black';
  return 'dt-diff-dark';
}
