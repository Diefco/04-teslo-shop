import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto, LoginUserDto } from './dto/';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: createUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard()) // This will protect the route with the JWT strategy.
  testingPrivateRoute(@Req() request: Express.Request) {
    console.log({ user: request.user });
    return {
      ok: true,
      message: 'This is a private route',
      user: { name: 'Diego' },
    };
  }
}
