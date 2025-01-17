import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { User } from '../../../domain/entities/user.entity';
import { Email } from 'src/shared/domain/value-objects/email-value-object';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(
    @InjectModel('User') private userModel: Model<User>
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel({
      ...user,
      email: user.email.toString()
    });
    return await createdUser.save();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { ...userData, updatedAt: new Date() },
      { new: true }
    ).exec();
    return this.mapToEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  private mapToEntity(document: any): User {
    return new User(
      document._id.toString(),
      document.name,
      document.email,
      document.password,
      document.createdAt,
      document.updatedAt
    );
  }
}
