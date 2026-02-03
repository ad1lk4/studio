declare module 'wav' {
  import { Writable } from 'stream';

  interface WriterOptions {
    channels?: number;
    sampleRate?: number;
    bitDepth?: number;
  }

  class Writer extends Writable {
    constructor(options?: WriterOptions);
  }

  const wav: { Writer: typeof Writer };
  export default wav;
}
