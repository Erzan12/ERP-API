import { IsInt } from 'class-validator';

export class DeletePersonDto {
  @IsInt()
  person_id: number;
}