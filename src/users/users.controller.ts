import { Controller, Get, UseGuards, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../decorators/user-id.decorator';
import { Connection, EntityManager, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import {
  InjectConnection,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(UserEntity) private repository: Repository<UserEntity>,
    @InjectConnection() private connection: Connection,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@UserId() id: number) {
    return this.usersService.findById(id);
  }

  @Post('delete')
  async deleteAll(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query('DELETE FROM users');
      await queryRunner.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
