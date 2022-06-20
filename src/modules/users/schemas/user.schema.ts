import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop()
	name: string;

	@Prop()
	email: string;

	@Prop()
	password: string;

	@Prop(
		raw({
			id: { type: String },
			expires: { type: Number },
		}),
	)
	reset_password?: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);