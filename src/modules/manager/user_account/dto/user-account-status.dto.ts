import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DeactivateUserAccountDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'The id number of the user you want to deactivate',
  })
  user_id: string;
}

export class ReactivateUserAccountDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'The id number of the user you want to reactivate',
  })
  user_id: string;
}
