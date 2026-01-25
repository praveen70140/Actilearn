export enum CodeExecutionStatus {
  InQueue = 1,
  Processing = 2,
  Accepted = 3,
  WrongAnswer = 4,
  TimeLimitExceeded = 5,
  CompilationError = 6,
  RuntimeErrorNZEC = 11,
  InternalError = 13,
}
