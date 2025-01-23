// src/app/functions/errors/invalid-file-format.ts
var InvalidFileFormat = class extends Error {
  constructor() {
    super("Invalid file format");
  }
};

export {
  InvalidFileFormat
};
