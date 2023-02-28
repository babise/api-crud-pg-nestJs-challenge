import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

      return await this.userRepository.save(createUserDto);
    } catch (error) {
      throw new Error('Error while creating user');
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.posts', 'posts')
        .getMany();

      return users;
    } catch (error) {
      throw new Error('Error while getting users');
    }
  }

  //find user by id and return user with posts
  async findOne(id: number) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.posts', 'posts')
        .where('user.id = :id', { id })
        .getOne();

      return user;
    } catch (error) {
      throw new Error('Error while getting user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      const userUpdate = { ...user, ...updateUserDto };
      await this.userRepository.save(userUpdate);
      return userUpdate;
    } catch (error) {
      throw new Error('Error while updating user');
    }
  }

  //soft delete user
  async remove(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      await this.userRepository.softRemove(user);
      return user;
    } catch (error) {
      throw new Error('Error while deleting user');
    }
  }
}
