import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Res() res, @Body() payload: LoginDto): Promise<JSON> {
    try {
      const user = await this.authService.findUserByEmail(payload.email);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid Email Or Password',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      const passwordIsValid = await bcrypt.compare(
        payload.password,
        user.password,
      );
      if (!passwordIsValid) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid Email Or Password',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      const token = this.jwtService.sign({
        user_id: user._id.toHexString(),
        email: user.email,
      });
      return res.status(HttpStatus.OK).json({
        data: {
          token: token,
          token_type: 'Bearer',
          expires_in: 60 * 60 * 24,
        },
        message: 'Successfully',
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  }

  @Post('/register')
  async register(@Res() res, @Body() payload: RegisterDto): Promise<JSON> {
    try {
      const user = await this.authService.findUserByEmail(payload.email);
      if (user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Email Alredy Exists',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      payload.password = await bcrypt.hash(payload.password, 10);
      const result = await this.authService.register(payload);
      return res.status(HttpStatus.OK).json({
        data: result,
        message: 'Successfully',
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  }
}
