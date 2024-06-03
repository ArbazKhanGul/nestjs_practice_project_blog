import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppConfigModule } from './app-config/app-config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app-config/app-config.service';
import { BlogPostModule } from './blog-post/blog-post.module';
import { PostCommentModule } from './post-comment/post-comment.module';

@Module({
  imports: [
    UserModule,
    AppConfigModule.register(),
    TypeOrmModule.forRootAsync({
      useFactory: (appConfigService: AppConfigService) => {
        return appConfigService.database.POSTGRES;
      },
      inject: [AppConfigService],
    }),
    BlogPostModule,
    PostCommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
