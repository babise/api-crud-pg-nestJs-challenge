import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCreateDto } from './entity/post-create.dto';
import { PostUpdateDto } from './entity/post-update.dto';
import { PostEntity } from './entity/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async getAllPosts(queries) {
    let { page, limit, search, order, published, categories } = queries;

    limit = limit ? +limit : 10;

    const query = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.user', 'user')
      .addSelect('user.firstname')
      .addSelect('user.lastname')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .addSelect('commentUser.firstname')
      .addSelect('commentUser.lastname')
      .addSelect('comments.content')
      .orderBy('comments.createdAt', 'DESC');

    if (published !== undefined) {
      query.andWhere('post.published = :published', { published });
    }

    if (categories) {
      const categoriesArray = categories.split(',');
      query.andWhere('categories.name IN (:...categories)', {
        categories: categoriesArray,
      });
    }

    const postList = query.limit(limit).getMany();

    return postList;
  }
  async getOnePostById(id: number) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'categories')
      .where('post.id = :id', { id })
      .getOne();

    return post;
  }
  async createPost(data: PostCreateDto) {
    try {
      //add user to post by id
      return await this.postRepository.save(data);
    } catch (error) {
      throw new Error('Error while creating post');
    }
  }
  async updatePost(id: number, data: PostUpdateDto) {
    const post = await this.postRepository.findOneBy({ id });
    const postUpdate = { ...post, ...data };
    await this.postRepository.save(postUpdate);

    return postUpdate;
  }
  async softDeletePost(id: number) {
    return await this.postRepository.softDelete(id);
  }
}
