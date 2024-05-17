import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'test1@domain.com',
    nullable: false,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
    minLength: 6,
    maxLength: 50,
    nullable: false,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  fullName: string;
}
