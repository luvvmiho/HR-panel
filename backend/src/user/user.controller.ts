import { Controller, Get, Delete, Patch, Param, Body, NotFoundException, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { hereglegch } from './user.entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  getAll(@Query('date') date?: string): Promise<hereglegch[]> {
    if (date) {
      return this.userService.findByDate(date);
    } else {
      return this.userService.findAll();
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.remove(+id);
    return { message: `User ${id} deleted` };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ): Promise<hereglegch> {
    const updated = await this.userService.update(+id, updateDto);
    if (!updated) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updated;
  }
}
