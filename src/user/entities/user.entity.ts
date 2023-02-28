import { CommentEntity } from 'src/comment/entities/comment.entity';
import { Timestamp } from 'src/Generic/timestamp.entity';
import { PostEntity } from 'src/post/entity/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: false,
  })
  firstname: string;

  @Column({
    nullable: false,
  })
  lastname: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
