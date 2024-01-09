import { User } from '../../users/users.service';

declare global {
    namespace Express {
        export interface Request {
            user?: { id: User['id'] };
        }
    }
}
