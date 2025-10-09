import { ComponentType, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// from MUI's toolpad we only use Notifications
import { Provider as JotaiProvider } from 'jotai';

import ThemeProvider from '@/theme/Provider';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

function render(App: ComponentType) {
  root.render(
    <StrictMode>
      <JotaiProvider>
        <ThemeProvider>
            <App />
        </ThemeProvider>
      </JotaiProvider>
    </StrictMode>,
  );
}

export default render;
