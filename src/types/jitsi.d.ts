declare module 'jitsi-meet' {
  export interface JitsiMeetExternalAPI {
    new (domain: string, options: any): any;
  }
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}