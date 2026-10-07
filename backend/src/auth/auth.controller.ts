import { Body, Controller, Get, Post, Session, UnauthorizedException, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    const { ovog, ner, gmail, utas, nuutsUg } = body;
    return await this.authService.signup(ovog, ner, gmail, utas, nuutsUg);
  }

  @Post('login')
  async login(
    @Body() body: { gmail: string; nuutsUg: string },
    @Session() session: Record<string, any>,
  ) {
    const user = await this.authService.validateUser(body.gmail, body.nuutsUg);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    session.isLoggedIn = true;
    session.userId = user.h_id;
    session.role = user.h_role;

    return { message: 'Амжилттай!', role: user.h_role };
  }

  @Post('logout')
  logout(@Session() session: Record<string, any>) {
    session.destroy((err) => {
      if (err) console.error('Session destroy error:', err);
    });
    return { message: 'Системээс гарлаа' };
  }

  @Get('me')
    async getSession(@Session() session: Record<string, any>): Promise<any> {
      if (!session.isLoggedIn || !session.userId) {
        throw new UnauthorizedException('Not logged in');
      }

      const user = await this.authService.findUserById(session.userId);
      if (!user) throw new UnauthorizedException('User not found');

      return user;
    }

}
