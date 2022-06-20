import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { pbkdf2 } from 'src/helpers/crypto';
import * as ms from 'ms';
import { v4 as uuid } from 'uuid';
import { UserDocument } from 'src/modules/users/schemas/user.schema';
import { UsersService } from 'src/modules/users/users.service';
import { RegisterDto, ResetPasswordDto, SendResetPasswordDto, SignInDto } from './dto/auth.dto';


@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) { }

	async login(signInDto: SignInDto) {
		const { email, password } = signInDto;

		const user = await this.usersService.findOne({ email });

		// Check account valid
		if (user) {
			const verify = await this.usersService.verifyPassword(user, password);
			if (verify) {
				// Build token
				const token = await this.generateToken(user);
				return { token };
			}
		}

		throw new UnauthorizedException('Email or password invalid');
	}

	async register(registerDto: RegisterDto) {
		const { email, password } = registerDto;

		// Check exist user
		const user = await this.usersService.findOne({ email });
		if (user) {
			throw new HttpException('This user has been created.', HttpStatus.BAD_REQUEST);
		}

		const hashPassword = await pbkdf2(password);
		registerDto.password = hashPassword;

		return this.usersService.create(registerDto);
	}

	async generateToken(user: UserDocument) {
		const accessToken = this.usersService.generateAccessToken(
			{
				userId: user._id,
				email: user.email
			},
			'30d',
			'superSecretKey'
		);

		return accessToken;
	}

	async verifyUser(payload) {
		try {
			return this.usersService.findOne({ email: payload.email ?? null });
		} catch (error) {

		}
	}

	async sendResetPasswordEmail(sendResetPasswordDto: SendResetPasswordDto) {
		try {
			const { email } = sendResetPasswordDto;
			const user = await this.usersService.findOne({ email });
			if (!user) {
				throw new HttpException('User is not exist.', HttpStatus.BAD_REQUEST);
			}

			const resetPasswordId = uuid();
			await this.usersService.update(user._id.toString(), {
				reset_password: {
					id: resetPasswordId,
					expires: Date.now() + ms('30m'),
				},
			});

			return {
				success: true,
				email: user.email,
				resetPasswordId: resetPasswordId
			};
		} catch (error) {
			throw error;
		}
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		const { reset_password_id: resetPasswordId, password } = resetPasswordDto;
		const user = await this.usersService.findOne({
			'reset_password.id': resetPasswordId,
			'reset_password.expires': { $gte: Date.now() },
		});
		if (!user) {
			throw new HttpException('This user has been created.', HttpStatus.BAD_REQUEST);
		}
		const hashPassword = await pbkdf2(password);
		await this.usersService.update(user._id.toString(), {
			password: hashPassword,
			reset_password: null
		});

		return {
			success: true,
			message: "Password was updated"
		};

	}
}
