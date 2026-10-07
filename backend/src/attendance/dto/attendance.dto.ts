import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  @IsNotEmpty()
  userHId: number;

  @IsString()
  @IsNotEmpty()
  date: string; // ISO format (e.g., '2025-05-28')

  @IsOptional()
  @IsString()
  checkInTime?: string; // ISO timestamp (e.g., '2025-05-28T09:00')

  @IsOptional()
  @IsString()
  checkOutTime?: string; // ISO timestamp (e.g., '2025-05-28T17:00')
}
