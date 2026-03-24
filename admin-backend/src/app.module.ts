import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  UserModule,
  AuthModule,
  UploadModule,
  DepartmentModule,
  DictModule,
  RoleModule,
  MenuModule,
  SystemModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    UploadModule,
    DepartmentModule,
    DictModule,
    RoleModule,
    MenuModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
