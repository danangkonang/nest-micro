import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/interface/auth.interface';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  async register(payload: RegisterDto): Promise<string> {
    try {
      const data = new this.userModel(payload);
      const menu = await data.save();
      return menu._id;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const data = await this.userModel.findOne({ email: email });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
