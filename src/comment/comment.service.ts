import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}
  // create comment async
  async create(createCommentDto: CreateCommentDto) {
    try {
      return await this.commentRepository.save(createCommentDto);
    } catch (error) {
      console.log(error);
      throw new Error('Error while creating comment');
    }
  }

  // find all comments async and return comments with user and post
  async findAll() {
    try {
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .getMany();
    } catch (error) {
      throw new Error('Error while getting comments');
    }
  }

  // find comment by id and return comment with user and post
  async findOne(id: number) {
    try {
      const comment = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .where('comment.id = :id', { id })
        .getOne();
      return comment;
    } catch (error) {
      throw new Error('Error while getting comment');
    }
  }

  // update comment async
  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.commentRepository.findOneBy({ id });
      const commentUpdate = { ...comment, ...updateCommentDto };
      await this.commentRepository.save(commentUpdate);
      return commentUpdate;
    } catch (error) {
      throw new Error('Error while updating comment');
    }
  }

  // softremove comment async
  async remove(id: number) {
    try {
      const comment = await this.commentRepository.findOneBy({ id });
      await this.commentRepository.softRemove(comment);
      return comment;
    } catch (error) {
      throw new Error('Error while deleting comment');
    }
  }
}
