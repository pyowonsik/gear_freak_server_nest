import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DeviceType } from '../entity/fcm-token.entity';

export class RegisterFcmTokenDto {
  @ApiProperty({
    description: 'FCM 토큰',
    example: 'fCkXYZ123...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: '디바이스 타입',
    enum: DeviceType,
    example: DeviceType.ios,
  })
  @IsEnum(DeviceType)
  @IsNotEmpty()
  deviceType: DeviceType;
}

export class DeleteFcmTokenDto {
  @ApiProperty({
    description: '삭제할 FCM 토큰',
    example: 'fCkXYZ123...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
