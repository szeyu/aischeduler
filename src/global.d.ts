// src/global.d.ts
declare module 'fs' {
    export const promises: {
      readFile: () => Promise<string>;
      writeFile: () => Promise<void>;
      // Add other methods as needed
    };
    export function readFileSync(): string;
    // Add other synchronous methods as needed
  }
  
  declare module 'path' {
    export function join(...args: string[]): string;
    export function resolve(...args: string[]): string;
    // Add other path methods as needed
  }
  
  declare module 'os' {
    export function tmpdir(): string;
    // Add other os methods as needed
  }
  
  // Add other Node.js modules as needed