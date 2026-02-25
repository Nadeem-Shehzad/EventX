import { PartialType } from '@nestjs/mapped-types';
import { RegisterDTO } from '../../auth/dto/request/register.dto';

export class UpdateUserDTO extends PartialType(RegisterDTO) {}