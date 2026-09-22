// TypeScript file with similar patterns
interface Config {
  getValue(): string;
}

class Logger {
  static error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
  
  static log(message: string): void {
    console.log(message);
  }
}

// These should NOT match when searching for exact patterns
toast.errorHandler("test"); // Similar but different
console.logout("hello world"); // Similar but different
array.slice(0, 1); // Similar but different
