import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppConfigModule } from './app-config/app-config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app-config/app-config.service';
import { BlogPostModule } from './blog-post/blog-post.module';
import { PostCommentModule } from './post-comment/post-comment.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    AppConfigModule.register(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
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
