import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signin(dto: AuthDto) {
    const user = await this.userService.findOneByEmail(dto.email);
    if (!user) throw new ForbiddenException('user not found');
    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new ForbiddenException('password incorrect');
    }
    delete user.password;
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
