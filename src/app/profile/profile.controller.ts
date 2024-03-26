import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './profile.dto';
import { JwtGuard } from '../auth/auth.guard';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @Put('update')
    async updateProfile(@Body() payload: UpdateProfileDto, @Req() req): Promise<import("/Users/zakyraihan/Documents/fullstackdev/backend/backend-nestjs/src/interface/respone/response.interface").ResponseSuccess> {
      const { id } = req.user;
      return this.profileService.updateProfile(+id, payload);
    }
}
