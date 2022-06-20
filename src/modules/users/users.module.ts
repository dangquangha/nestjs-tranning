import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
	imports: [
		PassportModule,
		JwtModule,
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		AuthModule
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService]
})

export class UsersModule { }
