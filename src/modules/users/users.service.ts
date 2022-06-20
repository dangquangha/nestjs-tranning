import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { comparePbkdf2 } from 'src/helpers/crypto';
import { generate } from 'src/helpers/jwt';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { RegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

	findAll() {
		return this.userModel.find();
	}

	findOne(filters) {
		return this.userModel.findOne(filters)
	}

	create(createUserDto: RegisterDto) {
		const createdUser = new this.userModel(createUserDto);
		return createdUser.save();
	}

	update(id: string, updateData) {
		return this.userModel.updateOne(
			{ _id: new mongoose.Types.ObjectId(id) },
			updateData
		);
	}

	remove(id: string) {
		return this.userModel
			.find({ _id: new mongoose.Types.ObjectId(id) })
			.deleteOne();
	}

	generateAccessToken(create, expiresIn: string, secret: string) {
		const { userId, email } = create;
		return generate(
			{
				userId,
				email,
			},
			expiresIn,
			secret,
		);
	}

	async verifyPassword(user, password: string) {
		if (!user.password) {
			throw new HttpException('Password is invalid.', HttpStatus.BAD_REQUEST);
		}
		return comparePbkdf2(password, user.password);
	}
}
