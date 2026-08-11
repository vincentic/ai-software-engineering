import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { Todo } from './entity/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'local',
      entities: [Todo],
      synchronize: true,
      charset: 'utf8',
      // match JDBC params: useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8
      extra: {
        timezone: 'Asia/Shanghai',
        ssl: false,
      },
    }),
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
