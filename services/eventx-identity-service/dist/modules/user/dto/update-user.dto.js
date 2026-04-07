"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const register_dto_1 = require("../../auth/dto/request/register.dto");
class UpdateUserDTO extends (0, mapped_types_1.PartialType)(register_dto_1.RegisterDTO) {
}
exports.UpdateUserDTO = UpdateUserDTO;
//# sourceMappingURL=update-user.dto.js.map