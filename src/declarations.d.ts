/// <reference types="jest" />

declare module '*.css';
declare module '*.svg' {
  const content: string;
  export default content;
}
