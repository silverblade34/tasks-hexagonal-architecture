import { User } from '../entities/user.entity';

export interface UserRepositoryPort {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: string, user: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
}
