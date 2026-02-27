import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ToolData {
  input: string;
  output: string;
  /** Second input for dual-input tools (e.g. json-diff) */
  input2?: string;
}

export type EditorMode = 'text' | 'tree' | 'table';

export interface ToolSearchState {
  open: boolean;
  query: string;
  replaceText: string;
  useRegex: boolean;
  matchCase: boolean;
  wholeWord: boolean;
  resultCount: number;
  activeResultIndex: number;
}

export interface ToolEditorPanelState {
  toolbarVisible: boolean;
  searchOpen: boolean;
  transformOpen: boolean;
  compareBridgeOpen: boolean;
}

interface WorkspaceState {
  activeTool: string;
  openTabs: string[];
  toolData: Record<string, ToolData>;
  editorModeByTool: Record<string, EditorMode>;
  searchStateByTool: Record<string, ToolSearchState>;
  editorPanelStateByTool: Record<string, ToolEditorPanelState>;
  theme: 'light' | 'dark' | 'black';
  sidebarCollapsed: boolean;
  recentTools: string[];
  favoriteTools: string[];
  base64Mode: 'encode' | 'decode';
  isFullscreen: boolean;
  /** 'input' = input panel fullscreen, 'output' = output panel fullscreen, 'none' = normal */
  panelFullscreen: 'none' | 'input' | 'output';
  showShortcutsModal: boolean;
  toasts: { id: number; message: string; type: 'success' | 'error' }[];

  // Actions
  setActiveTool: (id: string) => void;
  openTab: (id: string) => void;
  closeTab: (id: string) => void;
  setInput: (toolId: string, input: string) => void;
  setInput2: (toolId: string, input2: string) => void;
  setOutput: (toolId: string, output: string) => void;
  setEditorMode: (toolId: string, mode: EditorMode) => void;
  setSearchState: (toolId: string, next: Partial<ToolSearchState>) => void;
  setEditorPanelState: (toolId: string, next: Partial<ToolEditorPanelState>) => void;
  clearInput: (toolId: string) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  toggleFullscreen: () => void;
  setPanelFullscreen: (panel: 'none' | 'input' | 'output') => void;
  setBase64Mode: (mode: 'encode' | 'decode') => void;
  toggleFavorite: (toolId: string) => void;
  setShowShortcutsModal: (show: boolean) => void;
  addToast: (message: string, type: 'success' | 'error') => void;
  removeToast: (id: number) => void;
}

const MAX_RECENT = 5;

const DEFAULT_SEARCH_STATE: ToolSearchState = {
  open: false,
  query: '',
  replaceText: '',
  useRegex: false,
  matchCase: false,
  wholeWord: false,
  resultCount: 0,
  activeResultIndex: -1,
};

const DEFAULT_EDITOR_PANEL_STATE: ToolEditorPanelState = {
  toolbarVisible: true,
  searchOpen: false,
  transformOpen: false,
  compareBridgeOpen: false,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      activeTool: 'json-formatter',
      openTabs: ['json-formatter'],
      toolData: {},
      editorModeByTool: {},
      searchStateByTool: {},
      editorPanelStateByTool: {},
      theme: 'light',
      sidebarCollapsed: false,
      recentTools: [],
      favoriteTools: [],
      base64Mode: 'encode',
      isFullscreen: false,
      panelFullscreen: 'none',
      showShortcutsModal: false,
      toasts: [],

      setActiveTool: (id) => {
        const state = get();
        const recent = [id, ...state.recentTools.filter((t) => t !== id)].slice(
          0,
          MAX_RECENT
        );
        set({ activeTool: id, recentTools: recent });
      },

      openTab: (id) => {
        const state = get();
        if (!state.openTabs.includes(id)) {
          set({ openTabs: [...state.openTabs, id] });
        }
        state.setActiveTool(id);
      },

      closeTab: (id) => {
        const state = get();
        const tabs = state.openTabs.filter((t) => t !== id);
        const updates: Partial<WorkspaceState> = { openTabs: tabs };
        if (state.activeTool === id) {
          updates.activeTool = tabs[tabs.length - 1] || 'json-formatter';
        }
        if (tabs.length === 0) {
          updates.openTabs = ['json-formatter'];
          updates.activeTool = 'json-formatter';
        }
        set(updates);
      },

      setInput: (toolId, input) =>
        set((s) => ({
          toolData: {
            ...s.toolData,
            [toolId]: { ...s.toolData[toolId], input, output: s.toolData[toolId]?.output ?? '', input2: s.toolData[toolId]?.input2 ?? '' },
          },
        })),

      setInput2: (toolId, input2) =>
        set((s) => ({
          toolData: {
            ...s.toolData,
            [toolId]: { ...s.toolData[toolId], input2, input: s.toolData[toolId]?.input ?? '', output: s.toolData[toolId]?.output ?? '' },
          },
        })),

      setOutput: (toolId, output) =>
        set((s) => ({
          toolData: {
            ...s.toolData,
            [toolId]: { ...s.toolData[toolId], output, input: s.toolData[toolId]?.input ?? '', input2: s.toolData[toolId]?.input2 ?? '' },
          },
        })),

      setEditorMode: (toolId, mode) =>
        set((s) => ({
          editorModeByTool: {
            ...s.editorModeByTool,
            [toolId]: mode,
          },
        })),

      setSearchState: (toolId, next) =>
        set((s) => ({
          searchStateByTool: {
            ...s.searchStateByTool,
            [toolId]: {
              ...(s.searchStateByTool[toolId] ?? DEFAULT_SEARCH_STATE),
              ...next,
            },
          },
        })),

      setEditorPanelState: (toolId, next) =>
        set((s) => ({
          editorPanelStateByTool: {
            ...s.editorPanelStateByTool,
            [toolId]: {
              ...(s.editorPanelStateByTool[toolId] ?? DEFAULT_EDITOR_PANEL_STATE),
              ...next,
            },
          },
        })),

      toggleTheme: () =>
        set((s) => ({
          theme: s.theme === 'light' ? 'dark' : s.theme === 'dark' ? 'black' : 'light',
        })),

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      toggleFullscreen: () =>
        set((s) => ({ isFullscreen: !s.isFullscreen })),

      setPanelFullscreen: (panel) => set({ panelFullscreen: panel }),

      setBase64Mode: (mode) => set({ base64Mode: mode }),

      clearInput: (toolId) =>
        set((s) => ({
          toolData: {
            ...s.toolData,
            [toolId]: { input: '', output: '', input2: '' },
          },
        })),

      toggleFavorite: (toolId) =>
        set((s) => ({
          favoriteTools: s.favoriteTools.includes(toolId)
            ? s.favoriteTools.filter((t) => t !== toolId)
            : [...s.favoriteTools, toolId],
        })),

      setShowShortcutsModal: (show) => set({ showShortcutsModal: show }),

      addToast: (message, type) => {
        const id = Date.now();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 3000);
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'devtools-workspace',
      partialize: (state) => ({
        activeTool: state.activeTool,
        openTabs: state.openTabs,
        toolData: state.toolData,
        editorModeByTool: state.editorModeByTool,
        searchStateByTool: state.searchStateByTool,
        editorPanelStateByTool: state.editorPanelStateByTool,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        recentTools: state.recentTools,
        favoriteTools: state.favoriteTools,
        base64Mode: state.base64Mode,
      }),
    }
  )
);
