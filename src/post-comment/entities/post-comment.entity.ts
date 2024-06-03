import { BlogPost } from 'src/blog-post/entities/blog-post.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity({
  name: 'post_comments',
})
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  author_id: string;
  @ManyToOne(() => User)
  author: User;

  @Column()
  post_id: string;

  @ManyToOne(() => BlogPost)
  post: BlogPost;

  @Column({ nullable: true })
  parent_comment_id?: string;

  @ManyToOne(() => PostComment, { nullable: true })
  @JoinColumn({ name: 'parent_comment_id' })
  parent_comment?: PostComment;

  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
