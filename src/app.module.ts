import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppConfigModule } from './app-config/app-config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UserModule, AppConfigModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
