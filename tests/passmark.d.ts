declare module 'passmark' {
  import { Page } from '@playwright/test';
  export function ai(page: Page, instruction: string, options?: any): Promise<any>;
}
