import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'Test Test',
  })
  fullName: string;

  @ApiProperty({
    default: 'test@test.com',
  })
  email: string;

  @ApiProperty({
    default: '123',
  })
  password: string;
}
