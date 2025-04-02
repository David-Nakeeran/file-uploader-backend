class DatabaseError extends Error {
  constructor(err) {
    super(err.message);
    this.code = err.code;
    this.meta = err.meta;
  }
}

export default DatabaseError;
