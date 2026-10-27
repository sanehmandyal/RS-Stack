import type { Role } from '../config/permissions.js';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      auth?: {
        userId: string;
        email: string;
        name: string;
        role: Role;
        sessionId: string;
        csrfToken: string;
      };
    }
  }
}

export {};
