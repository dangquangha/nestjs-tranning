import { 
    IsDefined,
    IsEmail, 
    IsNotEmpty, 
    IsString 
} from "class-validator";

export class RegisterDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    password: string

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class SendResetPasswordDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class SignInDto {
    @IsDefined()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    password: string
}

export class ResetPasswordDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    reset_password_id: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    password: string
}
