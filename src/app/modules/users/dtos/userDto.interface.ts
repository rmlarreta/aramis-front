import { UserUpdateDto } from "./userUpdateDto.inteface"; 

export interface UserDto extends UserUpdateDto {
	roleName: string;
}